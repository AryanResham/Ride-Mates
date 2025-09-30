import React from "react";
import { useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import UserProfileCard from "../components/dashboard/UserProfileCard";
import CreateRidePanel from "../components/dashboard/CreateRidePanel";
import RequestsTab from "../components/dashboard/RequestsTab";
import MyRidesTab from "../components/dashboard/MyRidesTab";
import OverviewTab from "../components/dashboard/OverviewTab";
import Navbar from "../components/dashboard/Navbar";

function DriverDashboard() {
  const [activeTab, setActiveTab] = useState("create");
  const tabLabels = ["Overview", "My Rides", "Requests", "Create"];
  return (
    <div className="font-display bg-[#FAFAFA] w-full min-h-screen">
      <DashboardHeader />
      <div className="flex justify-center mt-4 mx-auto w-6xl gap-4 px-6">
        <UserProfileCard />
        <div className="max-w-6xl w-full mx-auto space-y-6d">
          <Navbar
            labels={tabLabels}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          {activeTab === "create" && <CreateRidePanel />}
          {activeTab === "requests" && <RequestsTab />}
          {activeTab === "my rides" && <MyRidesTab />}
          {activeTab === "overview" && <OverviewTab />}
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;
