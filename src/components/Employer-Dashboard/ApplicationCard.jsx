import React from 'react';
import { Calendar, Star, MessageCircle, Download, User, MapPin } from 'lucide-react';

const ApplicationCard = ({ application, onStatusChange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'offered': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          {application.avatar ? (
            <img src={application.avatar} alt={application.candidateName} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-gray-400" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{application.candidateName}</h3>
              <p className="text-sm text-gray-600">{application.candidateEmail}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>

          <div className="mb-3">
            <p className="text-sm font-medium text-gray-900 mb-1">Applied for: {application.position}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {application.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {application.appliedDate}
              </div>
              <div>{application.experience} experience</div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Rating:</span>
            <div className="flex items-center gap-1">
              {renderStars(application.rating)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
              <button className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Download className="w-4 h-4" />
                Resume
              </button>
            </div>
            
            <select
              value={application.status}
              onChange={(e) => onStatusChange(application.id, e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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