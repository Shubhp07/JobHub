import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  FileText, 
  Bookmark, 
  Eye, 
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Star,
  ArrowRight,
  User
} from 'lucide-react';

const DashboardOverview = () => {
  const [user, setUser] = useState({
    name: "User",
    email: "",
    userType: ""
  });

  const stats = [
    { label: 'Applications Sent', value: '24', change: '+12%', icon: FileText, color: 'bg-blue-500' },
    { label: 'Profile Views', value: '156', change: '+8%', icon: Eye, color: 'bg-green-500' },
    { label: 'Saved Jobs', value: '18', change: '+3', icon: Bookmark, color: 'bg-purple-500' },
    { label: 'Interviews', value: '5', change: '+2', icon: Calendar, color: 'bg-orange-500' },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          const response = await fetch('/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const userData = await response.json();
            console.log('User data from API:', userData);
            
            setUser({
              name: `${userData.firstName} ${userData.lastName}`,
              email: userData.email,
              userType: userData.userType === 'EMPLOYER' ? 'Employer' : 'Job Seeker'
            });
          } else {
            // Fallback to localStorage if API fails
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              const parsed = JSON.parse(storedUser);
              setUser({
                name: `${parsed.firstName} ${parsed.lastName}` || parsed.name || "User",
                email: parsed.email || "",
                userType: parsed.userType || "Job Seeker"
              });
            }
          }
        } else {
          // No token, use localStorage fallback
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser({
              name: `${parsed.firstName} ${parsed.lastName}` || parsed.name || "User",
              email: parsed.email || "",
              userType: parsed.userType || "Job Seeker"
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to localStorage on error
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser({
            name: `${parsed.firstName} ${parsed.lastName}` || parsed.name || "User",
            email: parsed.email || "",
            userType: parsed.userType || "Job Seeker"
          });
        }
      }
    };

    fetchUserProfile();
  }, []);

  const recentApplications = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      status: 'Interview Scheduled',
      statusColor: 'bg-green-100 text-green-800',
      appliedDate: '2 days ago',
      logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'InnovateLab',
      status: 'Under Review',
      statusColor: 'bg-yellow-100 text-yellow-800',
      appliedDate: '5 days ago',
      logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'DesignStudio',
      status: 'Application Sent',
      statusColor: 'bg-blue-100 text-blue-800',
      appliedDate: '1 week ago',
      logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    }
  ];

  const recommendedJobs = [
    {
      id: 1,
      title: 'React Developer',
      company: 'StartupXYZ',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$100k - $130k',
      match: '95%',
      posted: '1 day ago'
    },
    {
      id: 2,
      title: 'Frontend Engineer',
      company: 'TechGiant',
      location: 'New York, NY',
      type: 'Remote',
      salary: '$120k - $150k',
      match: '92%',
      posted: '3 days ago'
    }
  ];

  return (
    <div className="space-y-8 pt-6 px-6 pb-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
        <p className="text-blue-100 mb-6">Here's what's happening with your job search today.</p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-white text-blue-700 border border-blue-100 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition-colors shadow">
            Update Profile
          </button>
          <button className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-6 py-2 rounded-lg font-medium transition-colors shadow">
            Search Jobs
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-gray-200 shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <img
                  src={app.logo}
                  alt={app.company}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{app.title}</h3>
                  <p className="text-sm text-gray-600">{app.company}</p>
                  <p className="text-xs text-gray-500">{app.appliedDate}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.statusColor}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {recommendedJobs.map((job) => (
              <div key={job.id} className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </div>
                  <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    <Star className="h-3 w-3 mr-1" />
                    {job.match} match
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600 space-x-4 mb-3">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {job.type}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {job.salary}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{job.posted}</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all group">
            <div className="bg-blue-100 p-3 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Update Resume</h3>
              <p className="text-sm text-gray-600">Keep your profile current</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-green-200 hover:bg-green-50 transition-all group">
            <div className="bg-green-100 p-3 rounded-lg mr-4 group-hover:bg-green-200 transition-colors">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Skill Assessment</h3>
              <p className="text-sm text-gray-600">Showcase your abilities</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all group">
            <div className="bg-purple-100 p-3 rounded-lg mr-4 group-hover:bg-purple-200 transition-colors">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Schedule Interview</h3>
              <p className="text-sm text-gray-600">Manage your calendar</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
