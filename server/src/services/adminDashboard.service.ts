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
    const [
      usersTotal,
      usersByRole,
      usersByStatus,
      bookingsByStatus,
      paymentsByStatus,
      revenueAgg,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({ by: ["role"], _count: { role: true } }),
      prisma.user.groupBy({ by: ["status"], _count: { status: true } }),
      prisma.booking.groupBy({ by: ["status"], _count: { status: true } }),
      prisma.payment.groupBy({ by: ["status"], _count: { status: true } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCEEDED" as any } }),
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

    return {
      ok: true,
      status: 200,
      data: {
        users: { total: usersTotal, byRole: usersByRole, byStatus: usersByStatus },
        bookings: { byStatus: bookingsByStatus },
        payments: { byStatus: paymentsByStatus },
        revenue: { total: revenueAgg?._sum?.amount || 0 },
        breakdowns: { bookingsByCategory },
      },
    } as const;
  },

  async timeseries(query: any) {
    const metric = (query?.metric as string) || "bookings"; // users|bookings|payments|revenues
    const range = query?.range as string | undefined; // e.g., 7d, 24h
    const interval = (query?.interval as string) || "1 day"; // for timescale
    const { from, to } = parseRange(range);

    const useTimescale = process.env.TIMESCALEDB_ENABLED === "1";

    if (useTimescale) {
      // Requires TimescaleDB extension with time_bucket
      if (metric === "users") {
        const rows = await prisma.$queryRawUnsafe<any[]>(
          `SELECT time_bucket($1, "createdAt") AS bucket, COUNT(*)::int AS count FROM "User" WHERE "createdAt" BETWEEN $2 AND $3 GROUP BY bucket ORDER BY bucket`,
          interval,
          from,
          to
        );
        return { ok: true, status: 200, data: rows } as const;
      }
      if (metric === "bookings") {
        const rows = await prisma.$queryRawUnsafe<any[]>(
          `SELECT time_bucket($1, "createdAt") AS bucket, COUNT(*)::int AS count FROM "Booking" WHERE "createdAt" BETWEEN $2 AND $3 GROUP BY bucket ORDER BY bucket`,
          interval,
          from,
          to
        );
        return { ok: true, status: 200, data: rows } as const;
      }
      if (metric === "payments") {
        const rows = await prisma.$queryRawUnsafe<any[]>(
          `SELECT time_bucket($1, "createdAt") AS bucket, COUNT(*)::int AS count FROM "Payment" WHERE "createdAt" BETWEEN $2 AND $3 GROUP BY bucket ORDER BY bucket`,
          interval,
          from,
          to
        );
        return { ok: true, status: 200, data: rows } as const;
      }
      if (metric === "revenues") {
        const rows = await prisma.$queryRawUnsafe<any[]>(
          `SELECT time_bucket($1, "createdAt") AS bucket, SUM("amount")::bigint AS amount
           FROM "Payment"
           WHERE "createdAt" BETWEEN $2 AND $3 AND "status" = 'SUCCEEDED'
           GROUP BY bucket ORDER BY bucket`,
          interval,
          from,
          to
        );
        return { ok: true, status: 200, data: rows } as const;
      }
    }

    // Fallback without timescale: group by date (UTC)
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
