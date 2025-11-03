import StatsCard from "../ui/StatsCard";
import RecentRideItem from "../ui/RecentRideItem";
import QuickActionItem from "../ui/QuickActionItem";
import { Car, IndianRupee, Star, TrendingUp, Users } from "lucide-react";

export default function Overview() {
  const recentRides = [
    // {
    //   from: "Mumbai Central",
    //   to: "Pune",
    //   date: "Today, 2:00 PM",
    //   passengers: 2,
    //   earnings: "₹450",
    //   status: "completed",
    // },
    // {
    //   from: "Andheri",
    //   to: "Bandra",
    //   date: "Yesterday, 9:30 AM",
    //   passengers: 1,
    //   earnings: "₹180",
    //   status: "completed",
    // },
    // {
    //   from: "Thane",
    //   to: "Navi Mumbai",
    //   date: "Dec 27, 6:15 PM",
    //   passengers: 3,
    //   earnings: "₹320",
    //   status: "completed",
    // },
  ];
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          icon={<Car className="h-5 w-5" />}
          title="Active Rides"
          value="3"
          subtitle="Currently running"
          color="blue"
        />
        <StatsCard
          icon={<Users className="h-5 w-5" />}
          title="Total Passengers"
          value="47"
          subtitle="This month"
          color="green"
        />
        <StatsCard
          icon={<IndianRupee className="h-5 w-5" />}
          title="Monthly Earnings"
          value="₹4,250"
          subtitle="+12% from last month"
          color="yellow"
        />
        <StatsCard
          icon={<TrendingUp className="h-5 w-5" />}
          title="Success Rate"
          value="98%"
          subtitle="Completion rate"
          color="purple"
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        {/* Recent Rides */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Rides
          </h3>
          <div className="space-y-4">
            {recentRides.length === 0 ? (
              <p className="text-gray-500">No recent rides</p>
            ) : (
              recentRides.map((ride, index) => (
                <RecentRideItem
                  key={index}
                  from={ride.from}
                  to={ride.to}
                  date={ride.date}
                  passengers={ride.passengers}
                  earnings={ride.earnings}
                  status={ride.status}
                />
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <QuickActionItem
              icon={<Car className="h-4 w-4" />}
              title="Create New Ride"
              description="Start a new journey"
              color="yellow"
            />
            <QuickActionItem
              icon={<Users className="h-4 w-4" />}
              title="View Passenger Requests"
              description="3 pending requests"
              color="blue"
            />
            <QuickActionItem
              icon={<Star className="h-4 w-4" />}
              title="Rate Last Trip"
              description="Mumbai to Pune"
              color="green"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
