import React, { useState, useEffect } from 'react';
import { User, ChevronDown } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const UserProfileCorner = () => {
  const [user, setUser] = useState({
    name: "User",
    email: "",
    userType: "",
    profilePicture: null
  });
  const [isOpen, setIsOpen] = useState(false);

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
      return `${API_BASE_URL}${user.profilePicture}`;
    }
    if (user.name && user.name !== "User") {
      const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=3b82f6&color=fff&size=100&font-size=0.5`;
    }
    return "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop";
  };

  return (
    <div className="absolute top-4 right-6 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        <div className="relative shrink-0">
          <img
            src={getProfilePictureUrl()}
            alt={`${user.name}'s profile`}
            className="h-8 w-8 rounded-full object-cover border-2 border-white"
            onError={(e) => {
              e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=ef4444&color=fff&size=100";
            }}
          />
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 transform opacity-100 scale-100 transition-all origin-top-right">
          <div className="flex flex-col gap-1 border-b border-gray-100 pb-3 mb-1">
            <p className="text-base font-bold text-gray-900 truncate">{user.name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
          <div className="pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
              {user.userType}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileCorner;
