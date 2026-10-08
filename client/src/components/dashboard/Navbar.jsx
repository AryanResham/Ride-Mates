import Tab from "../ui/Tab";

// Segmented control: equal-width tabs in a single row inside one bordered track.
function Navbar({ labels, setActiveTab, activeTab }) {
  return (
    <div className="w-full flex gap-1 mb-4 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
      {labels &&
        labels.map((label) => (
          <Tab
            key={label}
            label={label}
            active={activeTab === label.toLowerCase()}
            onClick={() => setActiveTab(label.toLowerCase())}
          />
        ))}
    </div>
  );
}

export default Navbar;
