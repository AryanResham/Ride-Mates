import StepsCard from "../ui/StepsCard";

export default function HowItWorks({
  id = "how-it-works",
  passengerItems = defaultPassengerItems,
  driverItems = defaultDriverItems,
}) {
  return (
    <section id={id}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-10">
        <h2 className="text-center text-4xl font-bold text-slate-900">
          How Ride Mate Works
        </h2>

        {/* Outer bordered box with a dashed divider between the two columns */}
        <div className="flex justify-around md:flex-row gap-1 md:gap-1 mt-6 px-6">
          <StepsCard title="For Passengers" items={passengerItems} />
          <StepsCard title="For Drivers" items={driverItems} />
        </div>
      </div>
    </section>
  );
}

const defaultPassengerItems = [
  {
    text: "Set Your Destination",
    subtext: "Enter where you want to go and when you need to be there.",
  },
  {
    text: "Find Your Match",
    subtext: "Browse available drivers and choose your perfect ride mate.",
  },
  {
    text: "Enjoy the Ride",
    subtext: "Get picked up, enjoy the journey, and rate your experience.",
  },
];

const defaultDriverItems = [
  {
    text: "Share Your Route",
    subtext: "Post your planned journey and available seats.",
  },
  {
    text: "Accept Passengers",
    subtext: "Review requests and accept your preferred matches.",
  },
  {
    text: "Earn & Connect",
    subtext: "Share costs, make friends, and reduce your carbon footprint.",
  },
];
