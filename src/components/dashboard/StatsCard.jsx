import React from "react";

const StatsCard = ({ title, value, change, changeType, icon: Icon, color }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "increase":
        return "text-emerald-600 bg-emerald-50";
      case "decrease":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getIconBg = () => {
    switch (color) {
      case "blue":
        return "bg-blue-50 text-blue-600";
      case "emerald":
        return "bg-emerald-50 text-emerald-600";
      case "orange":
        return "bg-orange-50 text-orange-600";
      case "purple":
        return "bg-purple-50 text-purple-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {Number(value) || 0}
          </p>
          <div
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getChangeColor()}`}
          >
            {change}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${getIconBg()}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
