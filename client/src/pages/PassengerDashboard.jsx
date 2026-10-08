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
  const tabLabels = ["Find Rides", "My Requests", "History", "Profile"];
  return (
    <div className="font-display bg-[#FAFAFA] w-full min-h-screen">
      <DashboardHeader setMode={setMode} currentMode={currentMode} />
      <div className="flex flex-col lg:flex-row items-start max-w-6xl mt-4 mx-auto gap-4 px-4 sm:px-6 pb-10">
        <UserProfileCard view="passenger" />
        <div className="w-full min-w-0 flex-1">
          <Navbar labels={tabLabels} activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "history" && <HistoryPanel />}
          {activeTab === "find rides" && <FindRidesTab onRequested={() => setActiveTab("my requests")} />}
          {activeTab === "my requests" && <MyBookingsTab />}
          {activeTab === "profile" && <ProfileTab />}
        </div>
      </div>
    </div>
  );
}

export default PassengerDashboard;
