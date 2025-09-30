import { MapPin } from "lucide-react";

export default function RecentRideItem({
  from,
  to,
  date,
  passengers,
  earnings,
  status,
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg">
          <MapPin className="h-4 w-4 text-gray-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {from} → {to}
          </p>
          <p className="text-sm text-gray-500">
            {date} • {passengers} passengers
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-green-600">{earnings}</p>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {status}
        </span>
      </div>
    </div>
  );
}
