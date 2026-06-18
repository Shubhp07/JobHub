import React from 'react';
import { Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ menuItems, activeTab, setActiveTab, sidebarOpen = true, setSidebarOpen, onLogoutNavigate = '/login' }) => {
  const navigate = useNavigate();

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
    
    navigate(onLogoutNavigate, { replace: true });
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

      {/* Navigation */}
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
              {sidebarOpen && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={`ml-auto text-white text-xs px-2 py-1 rounded-full ${item.badgeColor || 'bg-blue-600'}`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
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
