import { Car, IndianRupee } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function UserProfileCard({
  name,
  role = "Ride Mate User",
  rating = 4.8,
  ridesCount = 0,
  earnings = 0,
  completionRate = 100,
  avatarUrl,
}) {
  const { user } = useAuth();
  
  // Use auth user data if available, otherwise use props
  const displayName = name || user?.displayName || user?.email?.split('@')[0] || "User";
  const displayAvatar = avatarUrl || user?.photoURL || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop";
  return (
    <aside className="w-full max-w-xs bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      {/* Avatar */}
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full ring-4 ring-gray-100 overflow-hidden">
          <img
            src={displayAvatar}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name */}
        <h3 className="mt-4 text-xl font-semibold text-gray-900">{displayName}</h3>

        {/* Role */}
        <p className="mt-1 text-gray-500">{role}</p>

        {/* Rating */}
        <p className="mt-2 flex items-center gap-1 text-gray-700">
          <span className="text-yellow-500">★</span>
          <span className="font-medium">{rating}</span>
          <span className="text-gray-400">({ridesCount} rides)</span>
        </p>
      </div>

      {/* Divider */}
      <hr className="my-6 border-gray-200" />

      {/* Stats */}
      <div className="space-y-5">
        <div className="h-full w-fit flex items-center gap-4">
          <span className=" p-2 bg-[#EEF2FF] rounded-xl flex items-center gap-2 text-md font-extrabold text-gray-900">
            <Car color="#1e4f94" />
          </span>
          <div className=" flex-col items-center gap-2 text-md font-bold text-gray-900">
            <p className="text-sm text-gray-500">Total Rides</p>
            {ridesCount}
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="h-full w-fit flex items-center gap-4">
          <span className=" p-2 bg-[#E9FDF4] rounded-xl flex items-center gap-2 text-md font-extrabold text-gray-900">
            <IndianRupee color="#059669" />
          </span>
          <div className=" flex-col items-center gap-2 text-md font-bold text-gray-900">
            <p className="text-sm text-gray-500">Total Earnings</p>${earnings}
          </div>
        </div>
      </div>
    </aside>
  );
}
