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
  User,
  Briefcase,
  Building,
  ChevronRight,
  BookmarkPlus,
  Send,
  CheckCircle,
  Search,
  Edit2
} from 'lucide-react';
import PageHeader from "../shared/PageHeader";
import { getMyApplications, getSavedJobs } from '../../api/applications';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';

const DashboardOverview = () => {
  const [user, setUser] = useState({
    name: "User",
    email: "",
    userType: ""
  });

  const [statsData, setStatsData] = useState({
    applicationsSent: 0,
    profileViews: 0, // Profile views might be mocked for now if there is no backend support
    savedJobs: 0,
    interviews: 0
  });

  const stats = [
    { label: 'Applications Sent', value: statsData.applicationsSent, change: '', icon: FileText, color: 'bg-spenceSecondary' },
    { label: 'Profile Views', value: statsData.profileViews, change: '', icon: Eye, color: 'bg-cyan-500' },
    { label: 'Saved Jobs', value: statsData.savedJobs, change: '', icon: Bookmark, color: 'bg-amber-500' },
    { label: 'Interviews', value: statsData.interviews, change: '', icon: Calendar, color: 'bg-[#ff7b5f]' },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/users/profile', {
          credentials: "include", headers
        });

        if (response.ok) {
          const userData = await response.json();
          setUser({
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            userType: userData.userType === 'EMPLOYER' ? 'Employer' : 'Job Seeker'
          });
          return;
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }

      // Fallback to localStorage if API fails
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: parsed.fullName || `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim() || "User",
          email: parsed.email || "",
          userType: parsed.userType || "Job Seeker"
        });
      }
    };

    const fetchDashboardStats = async () => {
      try {
        // Fetch total applications
        const appsRes = await getMyApplications();
        const totalApps = appsRes.totalElements || appsRes.content?.length || 0;

        // Fetch interviews
        const interviewsRes = await getMyApplications('INTERVIEW');
        const totalInterviews = interviewsRes.totalElements || interviewsRes.content?.length || 0;

        // Fetch saved jobs
        const savedRes = await getSavedJobs();
        const totalSaved = savedRes.totalElements || savedRes.content?.length || 0;

        setStatsData({
          applicationsSent: totalApps,
          profileViews: Math.floor(Math.random() * 50) + 10, // Mocked profile views
          savedJobs: totalSaved,
          interviews: totalInterviews
        });

      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };

    fetchUserProfile();
    fetchDashboardStats();
  }, []);

  const recentApplications = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      status: 'Interview Scheduled',
      statusColor: 'border border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
      appliedDate: '2 days ago',
      logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'InnovateLab',
      status: 'Under Review',
      statusColor: 'border border-amber-500/30 text-amber-400 bg-amber-500/5',
      appliedDate: '5 days ago',
      logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'DesignStudio',
      status: 'Application Sent',
      statusColor: 'border border-spenceSecondary/30 text-spenceSecondary bg-spenceSecondary/5',
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
      <div className="-mx-6 -mt-6 mb-6">
        <PageHeader 
          title={`Welcome back, ${user.name}! 👋`}
          subtitle="Here's what's happening with your job search today."
          buttonText="Search Jobs"
          onButtonClick={() => {}}
          showSearch={false}
          showViewToggle={false}
        />
      </div>

      {/* Stats Grid */}
      <BentoGrid className="mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <BentoGridItem
              key={index}
              title={stat.label}
              value={stat.value}
              change={stat.change}
              colorClass={stat.color}
              icon={<IconComponent className="h-6 w-6 text-white" />}
            />
          );
        })}
      </BentoGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-spenceCard rounded-2xl border border-[#1e3d4c] shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6 border-b border-[#183947]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-serif text-white">Recent Applications</h2>
              <button className="text-spenceSecondary hover:text-[#e04523] text-sm font-medium flex items-center">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-[#193644] transition-all border border-transparent hover:border-[#1e3d4c]">
                <img
                  src={app.logo}
                  alt={app.company}
                  className="w-12 h-12 rounded-xl object-cover shadow-sm border border-[#1e3d4c]"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">{app.title}</h3>
                  <p className="text-sm text-slate-400">{app.company}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{app.appliedDate}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${app.statusColor}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="bg-spenceCard rounded-2xl border border-[#1e3d4c] shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6 border-b border-[#183947]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-serif text-white">Recommended for You</h2>
              <button className="text-spenceSecondary hover:text-[#e04523] text-sm font-medium flex items-center">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {recommendedJobs.map((job) => (
              <div key={job.id} className="p-5 rounded-xl border border-[#1e3d4c] hover:border-spenceSecondary/30 hover:shadow-lg hover:shadow-spenceSecondary/5 transition-all bg-spencePrimary/30">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold font-serif text-white">{job.title}</h3>
                    <p className="text-sm text-slate-400">{job.company}</p>
                  </div>
                  <div className="flex items-center bg-spenceSecondary/10 text-spenceSecondary px-2.5 py-1 rounded-full text-xs font-semibold border border-spenceSecondary/30">
                    <Star className="h-3 w-3 mr-1" />
                    {job.match} match
                  </div>
                </div>
                <div className="flex items-center text-sm text-slate-300 space-x-4 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5 text-slate-500" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1.5 text-slate-500" />
                    {job.type}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1.5 text-slate-500" />
                    {job.salary}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#183947]">
                  <span className="text-xs font-medium text-slate-500">{job.posted}</span>
                  <button className="bg-spenceSecondary hover:bg-[#e04523] text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-spenceSecondary/25">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-spenceCard rounded-2xl border border-[#1e3d4c] p-6 shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl font-bold font-serif text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="flex items-center p-4 rounded-xl border border-[#1e3d4c] hover:border-spenceSecondary/30 hover:bg-[#193644] transition-all group shadow-sm hover:shadow-md">
            <div className="bg-spenceSecondary/10 p-3 rounded-xl mr-4 group-hover:bg-spenceSecondary/20 transition-colors">
              <FileText className="h-6 w-6 text-spenceSecondary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-white">Update Resume</h3>
              <p className="text-sm text-slate-400 mt-0.5">Keep your profile current</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 rounded-xl border border-[#1e3d4c] hover:border-spenceSecondary/30 hover:bg-[#193644] transition-all group shadow-sm hover:shadow-md">
            <div className="bg-spenceSecondary/10 p-3 rounded-xl mr-4 group-hover:bg-spenceSecondary/20 transition-colors">
              <TrendingUp className="h-6 w-6 text-spenceSecondary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-white">Skill Assessment</h3>
              <p className="text-sm text-slate-400 mt-0.5">Showcase your abilities</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 rounded-xl border border-[#1e3d4c] hover:border-spenceSecondary/30 hover:bg-[#193644] transition-all group shadow-sm hover:shadow-md">
            <div className="bg-spenceSecondary/10 p-3 rounded-xl mr-4 group-hover:bg-spenceSecondary/20 transition-colors">
              <Calendar className="h-6 w-6 text-spenceSecondary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-white">Schedule Interview</h3>
              <p className="text-sm text-slate-400 mt-0.5">Manage your calendar</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
