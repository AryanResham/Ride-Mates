import { Star, MessageSquare, Check, X } from "lucide-react";

export default function RequestCard({ request }) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-600">
              {request.passengerName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {request.passengerName}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span>{request.passengerRating}</span>
            </div>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[request.status]
          }`}
        >
          {request.status}
        </span>
      </div>

      <div className="mb-4">
        <p className="font-medium text-gray-900 mb-1">
          {request.rideFrom} → {request.rideTo}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{request.rideDate}</span>
          <span>
            {request.seatsRequested} seat{request.seatsRequested > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {request.message && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
            <p className="text-sm text-gray-700">{request.message}</p>
          </div>
        </div>
      )}

      {request.status === "pending" && (
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Check className="h-4 w-4 inline mr-1" />
            Accept
          </button>
          <button className="flex-1 px-4 py-2 bg-red-600 border border-gray-200 text-white rounded-lg hover:bg-red-700 transition-colors">
            <X className="h-4 w-4 inline mr-1" />
            Decline
          </button>
        </div>
      )}
    </div>
  );
}
