function Tab({ label, active, onClick, highlight = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-selected={active}
      className={[
        "px-5 py-2 rounded-lg text-sm font-medium border shadow-sm w-full",
        active && highlight
          ? "bg-yellow-400 text-gray-900 border-yellow-300"
          : active
          ? "bg-white text-gray-900 border-gray-200"
          : "bg-white text-gray-500 border-transparent",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
export default Tab;
