import React from 'react';
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
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ✅ 1. Import the useNavigate hook

const Sidebar = ({ activeTab, setActiveTab, onPostJob, sidebarOpen = true, setSidebarOpen }) => {
  const navigate = useNavigate(); // ✅ 2. Call the hook to get the navigate function

  const menuItems = [
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

  const handleLogout = async () => {
    console.log("Logout clicked");
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (e) {
      console.error("Logout failed on backend", e);
    }
    // Clear user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    
    // ✅ 3. Use the navigate function to redirect the user
    // The 'replace: true' option prevents the user from using the browser's
    // back button to return to the protected dashboard page.
    navigate('/login', { replace: true });
  };

  return (
    <aside className={`bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col pt-4 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
      {/* Logo as Toggle */}
      <div className={`hidden lg:flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} mb-6`}>
        <button 
          onClick={() => setSidebarOpen && setSidebarOpen(!sidebarOpen)}
          className="flex items-center focus:outline-none hover:opacity-80 transition-opacity"
          title="Toggle Sidebar"
        >
          <Search className="h-8 w-8 text-blue-600 shrink-0" />
          {sidebarOpen && <span className="text-2xl font-bold text-gray-900 ml-2">JobHub</span>}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-400'} ${!sidebarOpen && "mx-auto"}`} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className={`w-5 h-5 text-gray-400 ${!sidebarOpen && "mx-auto"}`} />
          {sidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
