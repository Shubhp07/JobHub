import React from 'react';
import { Calendar, Star, MessageCircle, Download, User, MapPin } from 'lucide-react';

const ApplicationCard = ({ application, onStatusChange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'border border-cyan-500/30 text-cyan-400 bg-cyan-500/5';
      case 'reviewing': return 'border border-amber-500/30 text-amber-400 bg-amber-500/5';
      case 'interviewed': return 'border border-violet-500/30 text-violet-400 bg-violet-500/5';
      case 'offered': return 'border border-emerald-500/30 text-emerald-400 bg-emerald-500/5';
      case 'rejected': return 'border border-red-500/30 text-red-400 bg-red-500/5';
      default: return 'border border-slate-700/30 text-slate-400 bg-slate-700/5';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-slate-700'}`}
      />
    ));
  };

  return (
    <div className="bg-spenceCard rounded-2xl border border-[#1e3d4c] p-6 hover:shadow-lg hover:shadow-spenceSecondary/5 hover:border-spenceSecondary/30 transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-spencePrimary/50 border border-[#1e3d4c] rounded-full flex items-center justify-center">
          {application.avatar ? (
            <img src={application.avatar} alt={application.candidateName} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-slate-500" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold font-serif text-white">{application.candidateName}</h3>
              <p className="text-sm text-slate-400">{application.candidateEmail}</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${getStatusColor(application.status)}`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>
 
          <div className="mb-3">
            <p className="text-sm font-semibold text-white mb-1">Applied for: {application.position}</p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-600" />
                {application.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-slate-600" />
                {application.appliedDate}
              </div>
              <div>{application.experience} experience</div>
            </div>
          </div>
 
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-slate-400">Rating:</span>
            <div className="flex items-center gap-1">
              {renderStars(application.rating)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1 px-4 py-1.5 text-sm text-white bg-spenceSecondary rounded-full hover:bg-[#e04523] transition-colors shadow-sm hover:shadow-spenceSecondary/25">
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
              <button className="inline-flex items-center gap-1 px-4 py-1.5 text-sm text-slate-300 bg-spencePrimary/50 border border-[#1e3d4c] rounded-full hover:bg-spencePrimary transition-colors">
                <Download className="w-4 h-4" />
                Resume
              </button>
            </div>
            
            <select
              value={application.status}
              onChange={(e) => onStatusChange(application.id, e.target.value)}
              className="text-sm border border-[#1e3d4c] rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-spenceSecondary focus:border-transparent bg-spencePrimary text-slate-300"
            >
              <option value="new">New</option>
              <option value="reviewing">Reviewing</option>
              <option value="interviewed">Interviewed</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;