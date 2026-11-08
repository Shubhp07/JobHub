import React from 'react';
import { Clock, User, Briefcase, MessageCircle, Eye } from 'lucide-react';

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'application': return <User className="w-4 h-4" />;
      case 'message': return <MessageCircle className="w-4 h-4" />;
      case 'view': return <Eye className="w-4 h-4" />;
      case 'interview': return <Briefcase className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'application': return 'bg-spencePrimary/50 text-cyan-400 border border-cyan-500/20';
      case 'message': return 'bg-spencePrimary/50 text-emerald-400 border border-emerald-500/20';
      case 'view': return 'bg-spencePrimary/50 text-violet-400 border border-violet-500/20';
      case 'interview': return 'bg-spencePrimary/50 text-spenceSecondary border border-spenceSecondary/20';
      default: return 'bg-spencePrimary/50 text-slate-400 border border-slate-700/20';
    }
  };

  return (
    <div className="bg-spenceCard rounded-2xl border border-[#1e3d4c] p-6 shadow-sm">
      <h3 className="text-lg font-bold font-serif text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`p-2 rounded-lg flex-shrink-0 flex items-center justify-center ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{activity.title}</p>
              <p className="text-sm text-slate-400 mb-1">{activity.description}</p>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-sm text-spenceSecondary hover:text-[#e04523] font-medium transition-colors">
        View all activity
      </button>
    </div>
  );
};

export default RecentActivity;