import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Menu, Settings } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const DashboardHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const [user, setUser] = useState({
    name: "User",
    email: "",
    userType: "",
    profilePicture: null
  });

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

      // Fallback to localStorage if API fails
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: `${parsed.firstName} ${parsed.lastName}` || parsed.fullName || "User",
          email: parsed.email || "",
          userType: parsed.userType === 'EMPLOYER' ? 'Employer' : 'Job Seeker',
          profilePicture: parsed.profilePicture
        });
      }
    };

    fetchUserProfile();
  }, []);

  const getProfilePictureUrl = () => {
    console.log('Getting profile picture for:', user.name, 'Profile pic:', user.profilePicture);
    
    if (user.profilePicture && user.profilePicture !== 'null' && user.profilePicture.trim() !== '') {
      if (user.profilePicture.startsWith('http')) {
        return user.profilePicture;
      }
      return `${API_BASE_URL}${user.profilePicture}`;
    }
    
    // Create avatar with user's initials since profilePicture is null
    if (user.name && user.name !== "User") {
      const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=3b82f6&color=fff&size=100&font-size=0.5`;
    }
    
    // Ultimate fallback
    return "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop";
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 h-20 w-full shrink-0 sticky top-0 z-10 transition-all duration-300">
      <div className="px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2.5 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <Link to="/" className="flex items-center ml-4 lg:hidden group">
              <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-1.5 rounded-lg mr-2 group-hover:shadow-md transition-all">
                <Search className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">JobHub</span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-6 ml-auto">
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

            {/* User Profile Section */}
            <button className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              <div className="relative">
                <img
                  src={getProfilePictureUrl()}
                  alt={`${user.name}'s profile`}
                  className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                  onError={(e) => {
                    console.log('Image failed to load, using fallback');
                    e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=ef4444&color=fff&size=100";
                  }}
                />
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
                <p className="text-xs text-gray-500 font-medium">{user.userType}</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
