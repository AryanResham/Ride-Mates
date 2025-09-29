import Tab from "../ui/Tab";

function Navbar({ setActiveTab, activeTab }) {
  return (
    <div className="w-full flex justify-between gap-3 mb-3">
      <Tab
        label="Overview"
        active={activeTab === "overview"}
        onClick={() => setActiveTab("overview")}
      />
      <Tab
        label="My Rides"
        active={activeTab === "myrides"}
        onClick={() => setActiveTab("myrides")}
      />
      <Tab
        label="Requests"
        active={activeTab === "requests"}
        onClick={() => setActiveTab("requests")}
      />
      <Tab
        label="Create Ride"
        active={activeTab === "create"}
        highlight
        onClick={() => setActiveTab("create")}
      />
    </div>
  );
}

export default Navbar;
