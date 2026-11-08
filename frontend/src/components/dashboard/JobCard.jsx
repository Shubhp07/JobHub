import React from 'react';
import { MapPin, Clock, Users, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';

const JobCard = ({ job, onEdit, onDelete, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'border border-emerald-500/30 text-emerald-400 bg-emerald-500/5';
      case 'paused': return 'border border-amber-500/30 text-amber-400 bg-amber-500/5';
      case 'closed': return 'border border-red-500/30 text-red-400 bg-red-500/5';
      default: return 'border border-slate-700/30 text-slate-400 bg-slate-700/5';
    }
  };

  return (
    <div className="bg-spenceCard rounded-2xl border border-[#1e3d4c] p-6 hover:shadow-lg hover:shadow-spenceSecondary/5 hover:border-spenceSecondary/30 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold font-serif text-white hover:text-spenceSecondary cursor-pointer transition-colors" onClick={() => onView(job.id)}>
              {job.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
          </div>
          <p className="text-sm text-slate-400 mb-2">{job.department}</p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-600" />
              {job.location}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-600" />
              {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ''}
            </div>
          </div>
        </div>
        <div className="relative group">
          <button className="p-2 hover:bg-spencePrimary/50 rounded-lg transition-colors">
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </button>
          <div className="absolute right-0 top-full mt-1 w-40 bg-spenceCard rounded-lg shadow-lg border border-[#1e3d4c] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <div className="py-1">
              <button 
                onClick={() => onView(job.id)}
                className="flex items-center w-full px-3 py-2 text-sm text-slate-300 hover:bg-spencePrimary/50 hover:text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
              <button 
                onClick={() => onEdit(job.id)}
                className="flex items-center w-full px-3 py-2 text-sm text-slate-300 hover:bg-spencePrimary/50 hover:text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Job
              </button>
              <button 
                onClick={() => onDelete(job.id)}
                className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-red-950/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#183947]">
        <div className="text-sm font-semibold text-white">{job.salary}</div>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-slate-600" />
            {job.applicationCount || 0} applications
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;