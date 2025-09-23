export default function Hero({
  titleBefore = "Your perfect",
  highlight = "Ride Mate",
  titleAfter = "is just a tap away",
  subtitle = "Smart matching, real-time updates, and safety-first rides. Find a ride or share your route in seconds.",
  primaryCta = { label: "Find a Ride", href: "#find-ride" },
  secondaryCta = { label: "Become a Driver", href: "#become-driver" },
}) {
  return (
    <section id="hero" className="bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Copy */}
          <div className="lg:col-span-7">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              {titleBefore}{" "}
              <span className="relative inline-block rounded-xl bg-yellow-200 px-2 -mx-1">
                {highlight}
              </span>{" "}
              {titleAfter}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl">
              {subtitle}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 ">
              <button className="inline-flex items-center justify-center rounded-xl bg-yellow-400 hover:bg-yellow-300 border border-yellow-500/60 px-4 py-2.5 text-md font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400">
                {primaryCta.label}
              </button>
              <button className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-md font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400">
                {secondaryCta.label}
              </button>
            </div>
          </div>

          {/* Visual (simple placeholder block; replace with your image or mockup later) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl border border-slate-200 p-6 overflow-hidden">
              <div
                className="absolute inset-0 -z-10 opacity-80"
                style={{
                  backgroundImage:
                    "radial-gradient(40% 40% at 70% 20%, #fde68a55, transparent 60%)",
                }}
              />
              <div className="h-64 sm:h-72 lg:h-80 rounded-2xl bg-gradient-to-br from-white via-yellow-50 to-white border border-yellow-100 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-2xl bg-yellow-300 ring-1 ring-yellow-400/60 flex items-center justify-center">
                    <span className="text-lg">🚗</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">PREVIEW</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
