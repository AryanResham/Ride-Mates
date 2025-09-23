export default function InfoCard({
  icon = "✨",
  heading = "Card Heading",
  content = "Short supporting copy goes here.",
  align = "left", // "left" | "center"
  className = "",
}) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <article
      className={`bg-[#FAFAFA] group rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-shadow ${className}`}
    >
      <div className={`flex flex-col gap-3 ${alignment}`}>
        {/* Icon in small yellow box */}
        <div
          className="h-10 w-10 rounded-xl bg-[#FFF7CC] ring-1 ring-[#FFF7CC] flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <span className="text-base leading-none">{icon}</span>
        </div>

        {/* Heading */}
        <h3 className="text-xl font-semibold text-slate-900">{heading}</h3>

        {/* Content */}
        <p className="text-md leading-6 text-slate-600">{content}</p>
      </div>
    </article>
  );
}
