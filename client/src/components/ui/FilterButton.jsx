function FilterButton({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-yellow-400 text-gray-900"
          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
      }`}
    >
      {label}
      {count && (
        <span className="ml-2 px-2 py-1 rounded-full bg-gray-200 text-xs">
          {count}
        </span>
      )}
    </button>
  );
}
export default FilterButton;
