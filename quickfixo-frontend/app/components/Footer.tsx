export default function Footer() {
  return (
    <footer className="mt-16 border-t border-primary-100 bg-white/90 text-[13px] text-primary-700">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:flex-row lg:items-start lg:gap-12">
        {/* Brand and summary */}
        <div className="w-full max-w-xs space-y-3 lg:max-w-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700 text-[13px] font-semibold text-cream-50 shadow-sm">
              QF
            </div>
            <div className="leading-tight">
              <p className="text-[15px] font-semibold text-shell-900">QuickFixo</p>
              <p className="text-[12px] text-primary-500">Home services, simplified.</p>
            </div>
          </div>
          <p className="text-primary-600">
            Book trusted technicians for AC, electrical, cleaning and appliance repair through one
            simple, app‑first experience.
          </p>
        </div>

        {/* Links columns */}
        <div className="flex w-full flex-1 flex-wrap justify-between gap-8 lg:justify-end">
          <div className="min-w-[140px] space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-shell-900">
              For customers
            </p>
            <ul className="space-y-1">
              <li className="cursor-pointer transition hover:text-primary-900">AC & cooling</li>
              <li className="cursor-pointer transition hover:text-primary-900">Electrical</li>
              <li className="cursor-pointer transition hover:text-primary-900">Appliance repair</li>
              <li className="cursor-pointer transition hover:text-primary-900">Home cleaning</li>
            </ul>
          </div>
          <div className="min-w-[140px] space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-shell-900">
              Company
            </p>
            <ul className="space-y-1">
              <li className="cursor-pointer transition hover:text-primary-900">About QuickFixo</li>
              <li className="cursor-pointer transition hover:text-primary-900">Partner with us</li>
              <li className="cursor-pointer transition hover:text-primary-900">Careers</li>
            </ul>
          </div>
          <div className="min-w-[180px] space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-shell-900">
              Support
            </p>
            <ul className="space-y-1">
              <li className="cursor-pointer transition hover:text-primary-900">Help & FAQs</li>
              <li className="cursor-pointer transition hover:text-primary-900">Safety guidelines</li>
              <li className="cursor-pointer transition hover:text-primary-900">Cancellations & refunds</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-100 bg-cream-100/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-[11px] text-primary-600 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} QuickFixo Technologies. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <p>Serving busy homes across multiple cities.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
