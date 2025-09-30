export default function StatRow({ label, value, tone = "blue" }) {
  const toneMap = {
    blue: "bg-blue-50 text-blue-900",
    green: "bg-green-50 text-green-900",
    yellow: "bg-yellow-50 text-yellow-900",
  };
  return (
    <div className={`rounded-lg p-4 ${toneMap[tone]}`}>
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
