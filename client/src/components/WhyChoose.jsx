import InfoCard from "./InfoCard";

export default function WhyChoose({
  id = "why-choose",
  title = "Why Choose Ride Mate?",
  items = defaultItems,
  className = "",
}) {
  return (
    <section id={id} className={` ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-6">
        <h2 className="text-center text-4xl md:text-4xl font-bold text-slate-900">
          {title}
        </h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, idx) => (
            <InfoCard
              key={idx}
              icon={item.icon}
              heading={item.heading}
              content={item.content}
              align="center"
              className="bg-white shadow-md"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const defaultItems = [
  {
    icon: "🧑‍🤝‍🧑",
    heading: "Trusted Community",
    content:
      "All users are verified with ratings and reviews to ensure quality experiences.",
  },
  {
    icon: "💸",
    heading: "Cost Effective",
    content: "Split fuel costs and save money while helping the environment.",
  },
  {
    icon: "🧭",
    heading: "Flexible Routes",
    content:
      "Find rides for any destination, from daily commutes to weekend trips.",
  },
];
