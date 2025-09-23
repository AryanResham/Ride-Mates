export default function StepsCard({
  title,
  items = [],
  start = 1,
  className = "",
}) {
  return (
    <div
      className={`h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-md ${className}`}
      role="region"
      aria-label={title}
    >
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>

      <ol className="mt-4 space-y-3">
        {items.map((it, idx) => {
          const isObj = typeof it === "object" && it !== null;
          const text = isObj ? it.text : it;
          const subtext = isObj ? it.subtext : null;

          return (
            <li key={idx} className="flex items-center gap-3 mb-4">
              {/* Number bubble */}
              <span
                className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[14px] font-semibold ring-1 ring-[#EEF2FF] text-[#3754FF]"
                aria-hidden="true"
              >
                {start + idx}
              </span>

              {/* Text */}
              <div>
                <p className="text-sm font-bold text-slate-800">{text}</p>
                {subtext && (
                  <p className="mt-0.5 text-sm text-[#5B6475]">{subtext}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
