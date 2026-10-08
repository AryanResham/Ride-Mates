import { Car, IndianRupee, MapPin, Route, Wallet } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function UserProfileCard({ view = "driver" }) {
  const { user } = useAuth();

  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const displayAvatar = user?.avatar || "/default-avatar.svg";
  const role = user?.isDriver ? "Driver" : "Passenger";

  const rating = user?.rating?.average || 0;
  const ratingCount = user?.rating?.count || 0;
  const stats = user?.stats || {};

  const showDriverStats = view === "driver" && user?.isDriver;

  return (
    <aside className="w-full max-w-xs bg-white rounded-lg shadow-sm border border-gray-100 p-6 self-start">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full ring-4 ring-gray-100 overflow-hidden bg-gray-100">
          <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
        </div>

        <h3 className="mt-4 text-xl font-semibold text-gray-900">{displayName}</h3>
        <p className="mt-1 text-gray-500">{role}</p>
        {user?.city && (
          <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {user.city}
          </p>
        )}

        <p className="mt-2 flex items-center gap-1 text-gray-700">
          <span className="text-yellow-500">★</span>
          <span className="font-medium">{rating.toFixed(1)}</span>
          <span className="text-gray-400">({ratingCount} ratings)</span>
        </p>

        {user?.bio && <p className="mt-3 text-sm text-gray-500 leading-relaxed">{user.bio}</p>}
      </div>

      <hr className="my-6 border-gray-200" />

      {showDriverStats ? (
        <div className="space-y-5">
          <StatLine icon={<Car color="#1e4f94" />} bg="#EEF2FF" label="Rides Driven" value={stats.totalRidesAsDriver || 0} />
          <hr className="border-gray-200" />
          <StatLine icon={<IndianRupee color="#059669" />} bg="#E9FDF4" label="Total Earnings" value={`₹${stats.totalEarnings || 0}`} />
          {user?.driverProfile?.vehicle?.model && (
            <>
              <hr className="border-gray-200" />
              <div>
                <p className="text-sm text-gray-500">Vehicle</p>
                <p className="font-medium text-gray-900">{user.driverProfile.vehicle.model}</p>
                <p className="text-xs text-gray-500">{user.driverProfile.vehicle.plateNumber}</p>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <StatLine icon={<Route color="#1e4f94" />} bg="#EEF2FF" label="Trips Taken" value={stats.totalRidesAsPassenger || 0} />
          <hr className="border-gray-200" />
          <StatLine icon={<Wallet color="#059669" />} bg="#E9FDF4" label="Total Spent" value={`₹${stats.totalSpent || 0}`} />
        </div>
      )}
    </aside>
  );
}

function StatLine({ icon, bg, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <span className="p-2 rounded-xl flex items-center" style={{ backgroundColor: bg }}>
        {icon}
      </span>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-md font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
