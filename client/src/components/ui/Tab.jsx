function Tab({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-selected={active}
      className={[
        "flex-1 min-w-0 whitespace-nowrap rounded-lg px-3 sm:px-5 py-2 text-sm font-medium transition",
        active
          ? "bg-yellow-400 text-gray-900 shadow-sm"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
export default Tab;
