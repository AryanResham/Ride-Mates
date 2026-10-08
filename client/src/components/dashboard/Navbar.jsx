import Tab from "../ui/Tab";

function Navbar({ labels, setActiveTab, activeTab }) {
  return (
    <div className="w-full flex flex-wrap gap-2 sm:gap-3 mb-3">
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
