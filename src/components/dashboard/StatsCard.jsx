import React from "react";

const StatsCard = ({ title, value, change, changeType, icon: Icon, color }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "increase":
        return "text-emerald-400 border border-emerald-500/30 bg-emerald-500/5";
      case "decrease":
        return "text-red-400 border border-red-500/30 bg-red-500/5";
      default:
        return "text-slate-400 border border-slate-700/30 bg-slate-700/5";
    }
  };

  const getIconBg = () => {
    switch (color) {
      case "blue":
        return "bg-spencePrimary/50 text-cyan-400 border border-cyan-500/20";
      case "emerald":
        return "bg-spencePrimary/50 text-emerald-400 border border-emerald-500/20";
      case "orange":
        return "bg-spencePrimary/50 text-spenceSecondary border border-spenceSecondary/20";
      case "purple":
        return "bg-spencePrimary/50 text-violet-400 border border-violet-500/20";
      default:
        return "bg-spencePrimary/50 text-slate-400 border border-slate-700/20";
    }
  };

  return (
    <div className="bg-spenceCard p-6 rounded-2xl shadow-sm border border-[#1e3d4c] hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold font-serif text-white mb-2">
            {Number(value) || 0}
          </p>
          {change && (
            <div
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getChangeColor()}`}
            >
              {change}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${getIconBg()}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
