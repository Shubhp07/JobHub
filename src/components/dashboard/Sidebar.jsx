import React from "react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  User,
  BarChart3,
  Building,
  FileText
} from "lucide-react";
import SharedSidebar from "../shared/Sidebar";

const Sidebar = ({ isEmployer, activeTab, setActiveTab, onPostJob, sidebarOpen = true, setSidebarOpen }) => {
  const jobSeekerMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "jobs", label: "Jobs", icon: Briefcase },
    { id: "applications", label: "Applications", icon: Users, badge: "12", badgeColor: "bg-green-600" },
    { id: "interviews", label: "Interviews", icon: Calendar },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: "3", badgeColor: "bg-blue-600" },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "profile", label: "Profile", icon: User },
  ];

  const employerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/dashboard/my-jobs' },
    { id: 'applications', label: 'Applications', icon: Users },
    { id: 'interviews', label: 'Interviews', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'company', label: 'Company Profile', icon: Building },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const menuItems = isEmployer ? employerMenuItems : jobSeekerMenuItems;

  return (
    <SharedSidebar
      menuItems={menuItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      onLogoutNavigate="/login"
    />
  );
};

export default Sidebar;
