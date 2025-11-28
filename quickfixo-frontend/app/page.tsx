import Link from "next/link";

const heroTiles = [
  { label: "Salon & beauty", icon: "💇‍♀️" },
  { label: "Cleaning", icon: "🧹" },
  { label: "Electrician", icon: "⚡" },
  { label: "AC & appliance repair", icon: "❄️" },
];

const heroImages = ["/capTechnican.png"]; // Technician with cap hero image from public

const popularServices = [
  {
    name: "AC servicing",
    description: "Deep clean, gas check, and cooling optimization.",
    priceLine: "Starts at ₹499",
    image: "/ACQF.png",
  },
  {
    name: "Electrician",
    description: "Fans, lights, and wiring handled safely by pros.",
    priceLine: "Starts at ₹199",
    image: "/electrican.png",
  },
  {
    name: "Deep cleaning",
    description: "Full home, kitchen, or bathroom deep cleaning.",
    priceLine: "Starts at ₹1299",
    image: "/homeClean.png",
  },
  {
    name: "Washing machine repair",
    description: "Front‑load and top‑load washing machine service & repair.",
    priceLine: "Starts at ₹499",
    image: "/washingMachine.png",
  },
];

const customerReviews = [
  {
    name: "Aditi",
    area: "HSR Layout",
    text: "The technician arrived on time and explained the issue clearly. Payment was super smooth.",
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Karan",
    area: "Koramangala",
    text: "Felt very similar to ordering from a top app – clean experience for small home repairs.",
    image:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Meera",
    area: "Indiranagar",
    text: "Loved the transparent pricing and follow‑up support when I had a question later.",
    image:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream-100 pt-20">
      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 pb-16 sm:px-6 lg:px-8 lg:flex-row lg:items-start">
        {/* Left: hero copy */}
        <div className="flex-1 space-y-4 text-center lg:text-left">
          <h1 className="text-[26px] font-semibold tracking-tight text-shell-900 sm:text-[32px]">
            Home services
            <span className="block text-primary-700">on tap with QuickFixo.</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-primary-400 lg:max-w-md">
            QuickFixo brings trusted home service professionals to your doorstep with clear pricing
            and easy online payments.
          </p>
          {/* Tile grid like "What are you looking for?" */}
          <div className="mt-3 w-full max-w-md rounded-2xl border border-primary-100 bg-white p-3 text-left shadow-sm">
            <p className="mb-2 text-[11px] font-medium text-shell-900">What are you looking for?</p>
            <div className="grid grid-cols-2 gap-2">
              {heroTiles.map((tile) => (
                <button
                  key={tile.label}
                  className="flex items-center gap-2 rounded-xl bg-cream-50 px-3 py-2 text-[11px] font-medium text-primary-700 hover:bg-primary-50"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[16px]">
                    {tile.icon}
                  </span>
                  <span className="truncate">{tile.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href="/booking"
              className="rounded-full bg-primary-700 px-5 py-2 text-sm font-semibold text-cream-50 shadow-sm transition hover:bg-primary-600"
            >
              Book a service
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-primary-200 bg-cream-50 px-5 py-2 text-sm font-medium text-primary-700 shadow-sm transition hover:border-primary-300 hover:bg-primary-50"
            >
              View services
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-primary-400 lg:justify-start">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              <span>Verified technicians</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              <span>No hidden charges</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              <span>Secure online payments</span>
            </div>
          </div>
        </div>

        {/* Right: single hero image (AC service) */}
        <div className="flex-1 w-full max-w-md lg:max-w-sm">
          <div className="overflow-hidden rounded-3xl shadow-sm">
            <img
              src={heroImages[0]}
              alt="AC service at home"
              className="h-72 w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Popular services */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-shell-900">Popular services near you</h2>
            <p className="text-[11px] text-primary-400">Based on thousands of recent QuickFixo bookings</p>
          </div>
          <button className="text-[11px] font-medium text-primary-600 hover:text-primary-700">
            View all
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularServices.map((service) => (
            <div
              key={service.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white text-[13px] text-primary-700 shadow-sm transition-transform hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
            >
              <div className="relative h-36 w-full overflow-hidden sm:h-40">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-shell-900/75 px-2 py-0.5 text-[10px] font-medium text-cream-50">
                  {service.priceLine}
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between p-3 pb-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1 text-[14px] font-semibold text-shell-900">
                    <span className="text-[16px]">
                      {service.name === "AC servicing" && "❄️"}
                      {service.name === "Electrician" && "⚡"}
                      {service.name === "Deep cleaning" && "🧹"}
                      {service.name === "Washing machine repair" && "🧺"}
                    </span>
                    <span>{service.name}</span>
                  </p>
                  <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-600">
                    4.7★
                  </span>
                </div>
                <p className="mb-3 text-[11px] text-primary-400">{service.description}</p>
                <button className="self-start rounded-full bg-cream-50 px-3 py-1.5 text-[11px] font-medium text-primary-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-50">
                  Book now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories strip */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-shell-900">Browse by category</h2>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 text-sm">
          {["AC & cooling", "Electrical", "Appliance repair", "Cleaning", "Plumbing", "Painting"].map(
            (cat) => (
              <button
                key={cat}
                className="shrink-0 rounded-full border border-primary-100 bg-white px-4 py-2 text-[12px] font-medium text-primary-700 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-300 hover:bg-primary-50"
              >
                {cat}
              </button>
            ),
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-shell-900">How QuickFixo works</h2>
            <p className="text-[11px] text-primary-400">Book in a few taps, get your home fixed on time</p>
          </div>
        </div>
        <div className="grid gap-4 text-[12px] text-primary-700 sm:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-2xl border border-primary-50 bg-white/90 p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-[13px] font-semibold text-primary-700">
                1
              </span>
              <p className="flex-1 text-[13px] font-semibold text-shell-900">Tell us what you need</p>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-[14px] text-primary-400">
                📝
              </span>
            </div>
            <p className="text-primary-400">
              Pick the service, describe the issue, and choose your preferred time slot.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl border border-primary-50 bg-white/90 p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-[13px] font-semibold text-primary-700">
                2
              </span>
              <p className="flex-1 text-[13px] font-semibold text-shell-900">We assign a pro</p>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-[14px] text-primary-400">
                👨‍🔧
              </span>
            </div>
            <p className="text-primary-400">
              QuickFixo matches you with a nearby verified technician with the right skills.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl border border-primary-50 bg-white/90 p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-[13px] font-semibold text-primary-700">
                3
              </span>
              <p className="flex-1 text-[13px] font-semibold text-shell-900">Relax, we fix it</p>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-[14px] text-primary-400">
                ✅
              </span>
            </div>
            <p className="text-primary-400">
              Track the visit, pay securely after the job, and rate your experience.
            </p>
          </div>
        </div>
      </section>

      {/* Top areas */}
      <section className="mx-auto max-w-6xl px-4 pb-12 text-[12px] text-primary-700 sm:px-6 lg:px-8">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-shell-900">Top areas in Bengaluru</h2>
            <p className="text-[11px] text-primary-400">
              Were expanding every week. These are some of the busiest neighbourhoods right now.
            </p>
          </div>
          <button className="shrink-0 text-[11px] font-medium text-primary-600 hover:text-primary-700">
            View all areas
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {["HSR Layout", "Koramangala", "Indiranagar", "Whitefield", "BTM Layout", "Marathahalli"].map(
            (area) => (
              <button
                key={area}
                className="rounded-full border border-primary-100 bg-white px-3.5 py-1.5 text-[11px] font-medium text-primary-700 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-300 hover:bg-primary-50"
              >
                {area}
              </button>
            ),
          )}
        </div>
      </section>

      {/* Customer reviews */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-shell-900">What customers say</h2>
            <p className="text-[11px] text-primary-400">Early QuickFixo users sharing their experience</p>
          </div>
        </div>
        <div className="grid gap-4 text-[12px] text-primary-700 sm:grid-cols-3">
          {customerReviews.map((review) => (
            <div
              key={review.name}
              className="flex flex-col justify-between rounded-2xl bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2">
                <img
                  src={review.image}
                  alt={review.name}
                  className="h-7 w-7 rounded-full object-cover"
                />
                <p className="text-[11px] text-primary-400">★★★★★</p>
              </div>
              <p className="mb-3 text-[12px] text-primary-700">{review.text}</p>
              <p className="text-[11px] font-semibold text-shell-900">
                {review.name}
                <span className="ml-1 font-normal text-primary-400">· {review.area}</span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

