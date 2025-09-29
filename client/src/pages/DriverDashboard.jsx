import React from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import UserProfileCard from "../components/dashboard/UserProfileCard";
import CreateRidePanel from "../components/dashboard/CreateRidePanel";

function DriverDashboard() {
  return (
    <div className="font-display bg-[#FAFAFA] w-full min-h-screen">
      <DashboardHeader />
      <div className="flex justify-center mt-4 mx-auto w-6xl gap-4 px-6">
        <UserProfileCard />
        <CreateRidePanel />
      </div>
    </div>
  );
}

export default DriverDashboard;
