import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Eye,
  MessageSquare,
  Filter
} from 'lucide-react';

const Applications = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const applications = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      appliedDate: '2024-01-15',
      status: 'interview',
      statusText: 'Interview Scheduled',
      statusColor: 'bg-green-100 text-green-800',
      logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
      salary: '$120k - $150k',
      location: 'San Francisco, CA',
      interviewDate: '2024-01-20',
      notes: 'Technical interview with the engineering team'
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'InnovateLab',
      appliedDate: '2024-01-12',
      status: 'review',
      statusText: 'Under Review',
      statusColor: 'bg-yellow-100 text-yellow-800',
      logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
      salary: '$100k - $130k',
      location: 'New York, NY',
      notes: 'Application submitted with portfolio'
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'DesignStudio',
      appliedDate: '2024-01-10',
      status: 'rejected',
      statusText: 'Not Selected',
      statusColor: 'bg-red-100 text-red-800',
      logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
      salary: '$80k - $100k',
      location: 'Austin, TX',
      notes: 'Position filled by internal candidate'
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'DataFlow Analytics',
      appliedDate: '2024-01-08',
      status: 'applied',
      statusText: 'Application Sent',
      statusColor: 'bg-blue-100 text-blue-800',
      logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
      salary: '$110k - $140k',
      location: 'Seattle, WA',
      notes: 'Waiting for initial response'
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      appliedDate: '2024-01-05',
      status: 'offer',
      statusText: 'Offer Received',
      statusColor: 'bg-purple-100 text-purple-800',
      logo: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
      salary: '$95k - $125k',
      location: 'Denver, CO',
      notes: 'Offer expires on January 25th'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Applications', count: applications.length },
    { id: 'applied', label: 'Applied', count: applications.filter(app => app.status === 'applied').length },
    { id: 'review', label: 'Under Review', count: applications.filter(app => app.status === 'review').length },
    { id: 'interview', label: 'Interview', count: applications.filter(app => app.status === 'interview').length },
    { id: 'offer', label: 'Offers', count: applications.filter(app => app.status === 'offer').length },
    { id: 'rejected', label: 'Rejected', count: applications.filter(app => app.status === 'rejected').length }
  ];

  const filteredApplications = activeFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status === activeFilter);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied':
        return <FileText className="h-5 w-5" />;
      case 'review':
        return <Clock className="h-5 w-5" />;
      case 'interview':
        return <Calendar className="h-5 w-5" />;
      case 'offer':
        return <CheckCircle className="h-5 w-5" />;
      case 'rejected':
        return <XCircle className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600">Track your job application progress</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Export Applications
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              <p className="text-sm text-gray-600">Total Applications</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'review').length}
              </p>
              <p className="text-sm text-gray-600">Under Review</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'interview').length}
              </p>
              <p className="text-sm text-gray-600">Interviews</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'offer').length}
              </p>
              <p className="text-sm text-gray-600">Offers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <div key={application.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <img
                  src={application.logo}
                  alt={application.company}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {application.title}
                  </h3>
                  <p className="text-gray-600 font-medium mb-2">{application.company}</p>
                  <div className="flex items-center text-sm text-gray-600 space-x-4 mb-3">
                    <span>{application.location}</span>
                    <span>{application.salary}</span>
                    <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                  </div>
                  {application.notes && (
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {application.notes}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${application.statusColor}`}>
                  {getStatusIcon(application.status)}
                  <span className="ml-2">{application.statusText}</span>
                </span>
              </div>
            </div>

            {application.interviewDate && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">
                    Interview scheduled for {new Date(application.interviewDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <Eye className="h-4 w-4 mr-1" />
                  View Job
                </button>
                <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Messages
                </button>
              </div>
              <div className="flex space-x-2">
                {application.status === 'offer' && (
                  <>
                    <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                      Decline
                    </button>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                      Accept Offer
                    </button>
                  </>
                )}
                {application.status === 'interview' && (
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Prepare Interview
                  </button>
                )}
                {application.status === 'applied' && (
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">
            {activeFilter === 'all' 
              ? "You haven't applied to any jobs yet." 
              : `No applications with status "${filters.find(f => f.id === activeFilter)?.label}".`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Applications;