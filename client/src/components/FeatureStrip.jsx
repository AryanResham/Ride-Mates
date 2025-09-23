import InfoCard from "./InfoCard";

export default function FeatureStrip({
  id = "features",
  items = defaultItems,
  className = "",
}) {
  return (
    <section id={id} className={`${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-6">
        <h2 className="text-center text-4xl font-bold text-slate-900">
          Features
        </h2>
        <div className="mt-6 flex gap-4 md:gap-6">
          {items.map((item, idx) => (
            <InfoCard
              key={idx}
              icon={item.icon}
              heading={item.heading}
              content={item.content}
              align="center"
              className="bg-white shadow-md flex-1"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const defaultItems = [
  {
    icon: "🧠",
    heading: "Smart Matching",
    content:
      "Our algorithm finds the perfect ride matches based on your route and preferences.",
  },
  {
    icon: "⏱️",
    heading: "Real-time Updates",
    content:
      "Track your ride live and get instant notifications about pickup times.",
  },
  {
    icon: "🛡️",
    heading: "Safety First",
    content:
      "Verified profiles, ratings system, and 24/7 support ensure your safety.",
  },
];
