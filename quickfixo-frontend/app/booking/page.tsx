export default function BookingPage() {
  return (
    <main className="min-h-screen bg-cream-100 pt-20">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-2xl font-semibold text-shell-900">New booking</h1>
        <p className="mb-6 text-sm text-primary-400">
          This is a placeholder booking flow. Well later connect it to your backend and payment logic.
        </p>
        <div className="rounded-2xl border border-primary-100 bg-white p-4 text-sm text-primary-700 shadow-sm">
          For now, use this page to plan the steps: select service, choose address, pick a time slot, and pay.
        </div>
      </section>
    </main>
  );
}
