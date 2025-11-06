import React from "react";
import { useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import UserProfileCard from "../components/dashboard/UserProfileCard";
import CreateRidePanel from "../components/dashboard/CreateRidePanel";
import RequestsTab from "../components/dashboard/RequestsTab";
import MyRidesTab from "../components/dashboard/MyRidesTab";
import ProfileTab from "../components/dashboard/ProfileTab";
import Navbar from "../components/dashboard/Navbar";

function DriverDashboard({ setMode, currentMode }) {
  const [activeTab, setActiveTab] = useState("my rides");
  const tabLabels = ["My Rides", "Requests", "Create", "Profile"];
  return (
    <div className="font-display bg-[#FAFAFA] w-full min-h-screen">
      <DashboardHeader setMode={setMode} currentMode={currentMode} />
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
          {activeTab === "profile" && <ProfileTab />}
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;
