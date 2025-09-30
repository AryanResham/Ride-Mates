import React from "react";

export default function QuickActionItem({ icon, title, description, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
    green: "bg-green-100 text-green-600 hover:bg-green-200",
    yellow: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
  };

  return (
    <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      <div className="text-left">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </button>
  );
}
