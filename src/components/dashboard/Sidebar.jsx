import React from "react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Building,
  FileText,
  MessageSquare,
  Plus,
  LogOut,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab, onPostJob }) => {
  const navigate = useNavigate();
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "jobs", label: "Jobs", icon: Briefcase },
    { id: "applications", label: "Applications", icon: Users },
    { id: "interviews", label: "Interviews", icon: Calendar },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "profile", label: "Profile", icon: User },
  ];

  const handleLogout = () => {
    console.log("Logout clicked");
    // Clear token and any other user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // You can add toast notification here if needed
    // Redirect logic can be added here
    navigate("/login");
  };

  return (
    <aside className="bg-white border-r border-gray-200 w-64 h-screen sticky top-0 flex flex-col pt-10">
      {/* Post Job Button */}
      {/* <div className="p-4 pt-24">
        <button 
          onClick={onPostJob}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Post New Job
        </button>
      </div> */}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-blue-700" : "text-gray-400"
                }`}
              />
              <span className="font-medium">{item.label}</span>
              {item.id === "messages" && (
                <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  3
                </span>
              )}
              {item.id === "applications" && (
                <span className="ml-auto bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  12
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-5 h-5 text-gray-400" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
