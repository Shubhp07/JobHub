import React, { useState, useEffect } from 'react';
import { Search, LogOut, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ menuItems, activeTab, setActiveTab, sidebarOpen = true, setSidebarOpen, onLogoutNavigate = '/login' }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "User",
    email: "",
    userType: "",
    profilePicture: null
  });
  const [showUserDetails, setShowUserDetails] = useState(false);

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
            userType: userData.userType === 'EMPLOYER' ? 'Employer' : 'Job Seeker',
            profilePicture: userData.profilePicture
          });
          return;
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim() || parsed.fullName || "User",
          email: parsed.email || "",
          userType: parsed.userType === 'EMPLOYER' ? 'Employer' : 'Job Seeker',
          profilePicture: parsed.profilePicture
        });
      }
    };

    fetchUserProfile();
  }, []);

  const getProfilePictureUrl = () => {
    if (user.profilePicture && user.profilePicture !== 'null' && user.profilePicture.trim() !== '') {
      if (user.profilePicture.startsWith('http')) return user.profilePicture;
      return `http://localhost:8080${user.profilePicture}`;
    }
    if (user.name && user.name !== "User") {
      const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=3b82f6&color=fff&size=100&font-size=0.5`;
    }
    return "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop";
  };

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
        
        {/* User Profile toggle */}
        <div className="relative mb-2">
          {showUserDetails && sidebarOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                <p className="text-xs font-semibold text-blue-600 mt-1">{user.userType}</p>
              </div>
            </div>
          )}
          <button 
            onClick={() => setShowUserDetails(!showUserDetails)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <div className="relative shrink-0">
              <img
                src={getProfilePictureUrl()}
                alt={`${user.name}'s profile`}
                className="h-8 w-8 rounded-full object-cover border border-gray-200"
                onError={(e) => {
                  e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=ef4444&color=fff&size=100";
                }}
              />
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></div>
            </div>
            {sidebarOpen && (
              <>
                <span className="font-medium truncate flex-1 text-sm">{user.name}</span>
                {showUserDetails ? <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" /> : <ChevronUp className="w-4 h-4 shrink-0 text-gray-400" />}
              </>
            )}
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className={`w-5 h-5 text-gray-400 hover:text-red-600 transition-colors ${!sidebarOpen && "mx-auto"}`} />
          {sidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
