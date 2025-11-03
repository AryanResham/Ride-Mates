import React from "react";
import { useState } from "react";
import HistoryPanel from "../components/dashboard/HistoryPanel";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import UserProfileCard from "../components/dashboard/UserProfileCard";
import Navbar from "../components/dashboard/Navbar";
import FindRidesTab from "../components/dashboard/FindRidesTab";
import MyBookingsTab from "../components/dashboard/MyBookingsTab";
import ProfileTab from "../components/dashboard/ProfileTab";

function PassengerDashboard({ setMode, currentMode }) {
  const [activeTab, setActiveTab] = useState("find rides");
  const tabLabels = ["Find Rides", "My Bookings", "History", "Profile"];
  return (
    <div className="font-display bg-[#FAFAFA] w-full min-h-screen">
      <DashboardHeader setMode={setMode} currentMode={currentMode} />
      <div className="flex justify-center mt-4 mx-auto w-6xl gap-4 px-6">
        <UserProfileCard />
        <div className="max-w-6xl w-full mx-auto space-y-6d">
          <Navbar
            labels={tabLabels}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          {activeTab === "history" && <HistoryPanel />}
          {activeTab === "find rides" && <FindRidesTab />}
          {activeTab === "my bookings" && <MyBookingsTab />}
          {activeTab === "profile" && <ProfileTab />}
        </div>
      </div>
    </div>
  );
}

export default PassengerDashboard;
