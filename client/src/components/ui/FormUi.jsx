function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={
        "w-full h-11 rounded-xl border border-gray-200 bg-gray-50/60 px-3 text-gray-800 placeholder-gray-400 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition " +
        className
      }
    />
  );
}

function Select({ options = [], className = "", ...props }) {
  return (
    <select
      {...props}
      className={
        "w-full h-11 rounded-xl border border-gray-200 bg-gray-50/60 px-3 text-gray-800 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition " +
        className
      }
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={
        "w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-gray-800 placeholder-gray-400 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition " +
        className
      }
    />
  );
}
export { Field, Input, Select, Textarea };
