import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, Menu, MessageSquare, Settings } from 'lucide-react';

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
        console.log('Token found:', !!token);
        
        if (token) {
          console.log('Fetching user profile from API...');
          const response = await fetch('/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log('API Response status:', response.status);

          if (response.ok) {
            // ADD THIS LINE - this was missing!
            const userData = await response.json();
            console.log('User data from API:', userData);
            console.log('Profile picture value:', userData.profilePicture);
            
            setUser({
              name: `${userData.firstName} ${userData.lastName}`,
              email: userData.email,
              userType: userData.userType === 'EMPLOYER' ? 'Employer' : 'Job Seeker',
              profilePicture: userData.profilePicture
            });
          }
        } else {
          // Fallback to localStorage if no token
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            console.log('Using localStorage fallback:', parsed);
            setUser({
              name: `${parsed.firstName} ${parsed.lastName}`,
              email: parsed.email,
              userType: parsed.userType === 'EMPLOYER' ? 'Employer' : 'Job Seeker',
              profilePicture: parsed.profilePicture
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to localStorage on error
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          console.log('Error fallback user data:', parsed);
          setUser({
            name: `${parsed.firstName} ${parsed.lastName}`,
            email: parsed.email,
            userType: parsed.userType === 'EMPLOYER' ? 'Employer' : 'Job Seeker',
            profilePicture: parsed.profilePicture
          });
        }
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
      return `http://localhost:8080${user.profilePicture}`;
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
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 h-16 left-0 right-0 z-50 w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <Link to="/" className="flex items-center ml-4 lg:ml-0">
              <Search className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">JobHub</span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search jobs, companies..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative">
              <MessageSquare className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                5
              </span>
            </button>

            {/* User Profile Section */}
            <div className="flex items-center space-x-3">
              <img
                src={getProfilePictureUrl()}
                alt={`${user.name}'s profile`}
                className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  console.log('Image failed to load, using fallback');
                  e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=ef4444&color=fff&size=100";
                }}
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
