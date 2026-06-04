import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Eye,
  MessageSquare,
  Loader
} from 'lucide-react';

const Applications = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applications from your existing API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('/api/applications/my-applications', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Applications data:', data);
        
        // Transform API data to match component structure
        const transformedApplications = data.content.map(app => ({
          id: app.id,
          title: app.jobTitle,
          company: app.company,
          appliedDate: app.appliedAt,
          status: app.status.toLowerCase(),
          statusText: getStatusText(app.status),
          statusColor: getStatusColor(app.status),
          logo: app.companyLogo || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
          salary: formatSalary(app.salaryMin, app.salaryMax),
          location: app.jobLocation || 'Location not specified',
          interviewDate: app.interviewDate,
          notes: app.notes || ''
        }));

        setApplications(transformedApplications);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Helper function to format salary
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not specified';
    if (!max) return `$${min}k+`;
    if (!min) return `Up to $${max}k`;
    return `$${min}k - $${max}k`;
  };

  // Helper functions to map status from API
  const getStatusText = (status) => {
    const statusMap = {
      'APPLIED': 'Application Sent',
      'REVIEW': 'Under Review', 
      'INTERVIEW': 'Interview Scheduled',
      'OFFER': 'Offer Received',
      'REJECTED': 'Not Selected',
      'WITHDRAWN': 'Withdrawn'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'APPLIED': 'bg-blue-100 text-blue-800',
      'REVIEW': 'bg-yellow-100 text-yellow-800',
      'INTERVIEW': 'bg-green-100 text-green-800', 
      'OFFER': 'bg-purple-100 text-purple-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'WITHDRAWN': 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

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

  // Filter applications
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading applications</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600">Track your job application progress ({applications.length} total)</p>
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

      {filteredApplications.length === 0 && !loading && (
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
