export default function Hero({
  titleBefore = "Your Perfect",
  titleHighlight = "Ride Mate",
  titleAfter = "is Just a Tap Away",
  subtitle = "Connect with trusted drivers and passengers in your area. Safe, affordable, and convenient ride sharing for everyone.",
  primaryCta = { label: "Find a Ride", href: "#find", icon: "📍" },
  secondaryCta = { label: "Become a Driver", href: "#driver", icon: "🚗" },
}) {
  return (
    <section>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-0 md:pt-20 md:pb-4 text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-slate-900">
          {titleBefore}{" "}
          <span className="text-yellow-500">{titleHighlight}</span>
          <br className="hidden sm:block" /> {titleAfter}
        </h1>

        {/* Subtext */}
        <p className="mt-4 md:mt-5 text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
          {subtitle}
        </p>

        {/* CTAs */}
        <div className="mt-6 md:mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={primaryCta.href}
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold font-lg text-slate-900 border border-yellow-500/60 hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <span aria-hidden="true">{primaryCta.icon}</span>
            {primaryCta.label}
          </a>
          <a
            href={secondaryCta.href}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold font-lg text-slate-800 border border-slate-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <span aria-hidden="true">{secondaryCta.icon}</span>
            {secondaryCta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
