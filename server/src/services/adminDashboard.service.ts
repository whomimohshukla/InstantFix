import { prisma } from "../lib/prisma";

function parseRange(range?: string): { from: Date; to: Date } {
  const to = new Date();
  let from = new Date();
  const r = (range || "7d").toLowerCase();
  if (r.endsWith("d")) {
    const days = parseInt(r.slice(0, -1), 10) || 7;
    from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  } else if (r.endsWith("h")) {
    const hrs = parseInt(r.slice(0, -1), 10) || 24;
    from = new Date(to.getTime() - hrs * 60 * 60 * 1000);
  } else {
    from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  return { from, to };
}

export const adminDashboardService = {
  async summary() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      usersTotal,
      usersByRole,
      usersByStatus,
      bookingsByStatus,
      paymentsByStatus,
      revenueAgg,
      revenue7dAgg,
      revenue30dAgg,
      refundsAgg,
      bookingsTotal,
      bookingsToday,
      bookings7d,
      bookings30d,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({ by: ["role"], _count: { role: true } }),
      prisma.user.groupBy({ by: ["status"], _count: { status: true } }),
      prisma.booking.groupBy({ by: ["status"], _count: { status: true } }),
      prisma.payment.groupBy({ by: ["status"], _count: { status: true } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCEEDED" as any } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "SUCCEEDED" as any, createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "SUCCEEDED" as any, createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.refund.aggregate({ _sum: { amount: true } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.booking.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.booking.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    ]);

    // bookings by category breakdown (raw SQL join)
    const bookingsByCategory = await prisma.$queryRawUnsafe<any[]>(
      `SELECT sc.id, sc.name, COUNT(b.id)::int AS count
       FROM "Booking" b
       JOIN "Service" s ON s.id = b."serviceId"
       JOIN "ServiceCategory" sc ON sc.id = s."categoryId"
       GROUP BY sc.id, sc.name
       ORDER BY count DESC`
    );

    // top services by completed bookings and revenue
    const topServices = await prisma.$queryRawUnsafe<any[]>(
      `SELECT s.id,
              s.name,
              COUNT(b.id)::int            AS orders,
              COALESCE(SUM(b."priceFinal"), 0)::bigint AS revenue
       FROM "Booking" b
       JOIN "Service" s ON s.id = b."serviceId"
       WHERE b.status = 'COMPLETED'
       GROUP BY s.id, s.name
       ORDER BY orders DESC
       LIMIT 10`
    );

    // top technicians by completed jobs and earnings
    const topTechnicians = await prisma.$queryRawUnsafe<any[]>(
      `SELECT u.id,
              COALESCE(u.name, '') AS name,
              COUNT(b.id)::int      AS jobs,
              COALESCE(SUM(e.amount), 0)::bigint AS earnings
       FROM "Booking" b
       JOIN "User" u ON u.id = b."technicianId"
       LEFT JOIN "Earning" e ON e."bookingId" = b.id
       WHERE b.status = 'COMPLETED' AND b."technicianId" IS NOT NULL
       GROUP BY u.id, u.name
       ORDER BY jobs DESC
       LIMIT 10`
    );

    // quick role counts for convenience
    const customersCount = usersByRole.find((r) => r.role === "CUSTOMER")?._count.role || 0;
    const techniciansCount = usersByRole.find((r) => r.role === "TECHNICIAN")?._count.role || 0;
    const adminsCount = usersByRole.find((r) => r.role === "ADMIN")?._count.role || 0;

    return {
      ok: true,
      status: 200,
      data: {
        users: {
          total: usersTotal,
          byRole: usersByRole,
          byStatus: usersByStatus,
          counts: {
            customers: customersCount,
            technicians: techniciansCount,
            admins: adminsCount,
          },
        },
        bookings: {
          total: bookingsTotal,
          today: bookingsToday,
          last7d: bookings7d,
          last30d: bookings30d,
          byStatus: bookingsByStatus,
        },
        payments: { byStatus: paymentsByStatus },
        revenue: {
          total: revenueAgg?._sum?.amount || 0,
          last7d: revenue7dAgg?._sum?.amount || 0,
          last30d: revenue30dAgg?._sum?.amount || 0,
          refundsTotal: refundsAgg?._sum?.amount || 0,
        },
        breakdowns: {
          bookingsByCategory,
          topServices,
          topTechnicians,
        },
      },
    } as const;
  },

  async timeseries(query: any) {
    const metric = (query?.metric as string) || "bookings"; // users|bookings|payments|revenues
    const range = query?.range as string | undefined; // e.g., 7d, 24h
    const interval = (query?.interval as string) || "1 day"; // for timescale
    const { from, to } = parseRange(range);
    // Use plain Postgres: group by date (UTC)
    if (metric === "revenues") {
      const rows = await prisma.$queryRawUnsafe<any[]>(
        `SELECT DATE_TRUNC('day', "createdAt") AS bucket, SUM("amount")::bigint AS amount
         FROM "Payment"
         WHERE "createdAt" BETWEEN $1 AND $2 AND "status" = 'SUCCEEDED'
         GROUP BY bucket ORDER BY bucket`,
        from,
        to
      );
      return { ok: true, status: 200, data: rows } as const;
    } else {
      const table = metric === "users" ? "User" : metric === "payments" ? "Payment" : "Booking";
      const rows = await prisma.$queryRawUnsafe<any[]>(
        `SELECT DATE_TRUNC('day', "createdAt") AS bucket, COUNT(*)::int AS count FROM "${table}" WHERE "createdAt" BETWEEN $1 AND $2 GROUP BY bucket ORDER BY bucket`,
        from,
        to
      );
      return { ok: true, status: 200, data: rows } as const;
    }
  },
};
