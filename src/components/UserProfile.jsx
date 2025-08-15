import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Upload,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Award,
  Briefcase,
  GraduationCap,
  Star,
  Download,
  ExternalLink,
} from "lucide-react";
import { userService } from "../services/userService.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const UserProfile = ({ userId = null, isOwnProfile = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [showModal, setShowModal] = useState(false); // For resume view modal
  const { user } = useAuth();

  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      let response;
      if (userId && !isOwnProfile) {
        response = await userService.getUserProfile(userId);
      } else {
        response = await userService.getCurrentUserProfile();
      }
      setProfileData(response);
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      resumeUrl: response.resumeUrl, // response.resumeUrl is just the string you need
    }));
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const updatedProfile = await userService.updateProfile(profileData);
      setProfileData(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSkillAdd = () => {
    if (
      newSkill.trim() &&
      profileData.skills &&
      !profileData.skills.includes(newSkill.trim())
    ) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleFileUpload = async (file, type) => {
    try {
      setLoading(true);
      let response;
      if (type === "resume") {
        response = await userService.uploadResume(file);
        // What does your backend return? Is it { resumeUrl: ... } or just the string?
        setProfileData((prev) => ({
          ...prev,
          // This handles both cases:
          resumeUrl: response.resumeUrl || response,
        }));
      }
      // (profile picture logic ...)
    } catch (err) {
      setError(err.message || "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={fetchUserProfile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-xl">Profile not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          {isOwnProfile && (
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600">
                  Manage your professional information
                </p>
              </div>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Profile Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <img
                  src={
                    profileData.profilePicture ||
                    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                {isEditing && isOwnProfile && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files[0] &&
                        handleFileUpload(e.target.files, "profile")
                      }
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={profileData.firstName || ""}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        value={profileData.lastName || ""}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Last Name"
                      />
                    </div>
                    <input
                      type="text"
                      value={profileData.title || ""}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Professional Title"
                    />
                    <textarea
                      value={profileData.bio || ""}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Professional Bio"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    <p className="text-lg text-blue-600 font-medium mb-3">
                      {profileData.title}
                    </p>
                    <p className="text-gray-700 mb-4">{profileData.bio}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {profileData.email}
                      </div>
                      {profileData.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {profileData.phone}
                        </div>
                      )}
                      {profileData.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {profileData.location}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h3>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location || ""}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{profileData.email}</p>
                  </div>
                </div>
                {profileData.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{profileData.phone}</p>
                    </div>
                  </div>
                )}
                {profileData.location && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{profileData.location}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Skills Section */}
          {((profileData.skills && profileData.skills.length > 0) ||
            isEditing) && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                {isEditing && isOwnProfile && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSkillAdd()}
                      placeholder="Add skill"
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <button
                      onClick={handleSkillAdd}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(profileData.skills || []).map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    <span>{skill}</span>
                    {isEditing && isOwnProfile && (
                      <button
                        onClick={() => handleSkillRemove(skill)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resume Section */}
          {(profileData.resumeUrl || isOwnProfile) && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
                {isOwnProfile && (
                  <label className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center cursor-pointer">
                    <Upload className="h-4 w-4 mr-1" />
                    {profileData.resumeUrl ? "Update Resume" : "Upload Resume"}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        e.target.files[0] &&
                        handleFileUpload(e.target.files, "resume")
                      }
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {profileData.resumeUrl ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <Download className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Resume.pdf</p>
                      <p className="text-sm text-gray-600">
                        Uploaded{" "}
                        {new Date(profileData.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <a
                      href={profileData.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Download
                    </a>
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Download className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No resume uploaded yet</p>
                </div>
              )}

              {/* Resume Modal */}
              {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
                    <button
                      onClick={() => setShowModal(false)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <h4 className="text-xl font-bold mb-4">Resume Preview</h4>
                    <div className="w-full h-[600px]">
                      <iframe
                        src={
                          typeof profileData.resumeUrl === "string"
                            ? profileData.resumeUrl.startsWith("{")
                              ? JSON.parse(profileData.resumeUrl).resumeUrl
                              : profileData.resumeUrl
                            : profileData.resumeUrl &&
                              profileData.resumeUrl.resumeUrl
                        }
                        title="Resume Preview"
                        width="100%"
                        height="100%"
                        className="border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Type Badge */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Account Type
                </h3>
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      profileData.userType === "JOBSEEKER"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {profileData.userType === "JOBSEEKER" ? (
                      <>
                        <User className="h-4 w-4 mr-1" />
                        Job Seeker
                      </>
                    ) : (
                      <>
                        <Briefcase className="h-4 w-4 mr-1" />
                        Employer
                      </>
                    )}
                  </span>
                  {profileData.emailVerified && (
                    <span className="ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Award className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Member since</p>
                <p className="font-medium">
                  {new Date(profileData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
