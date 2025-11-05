import { Calendar, Clock, Users, Eye } from "lucide-react";

export default function RideCard({ ride }) {
  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">
              {ride.from.split(",")[0].charAt(0).toUpperCase() +
                ride.from.split(",")[0].slice(1)}{" "}
              →{" "}
              {ride.to.split(",")[0].charAt(0).toUpperCase() +
                ride.to.split(",")[0].slice(1)}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                statusColors[ride.status]
              }`}
            >
              {ride.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {ride.departureDateTime.split("T")[0]}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {ride.departureDateTime.split("T")[1].split(".")[0]}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {ride.availableSeats} seats
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">
            ₹{ride.pricePerSeat}
          </p>
          <p className="text-sm text-gray-500">per seat</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600">{ride.vehicle}</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
            <Eye className="h-4 w-4 inline mr-1" />
            View Details
          </button>
          {ride.status === "upcoming" && (
            <button className="px-3 py-1 text-sm bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300">
              Edit Ride
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
