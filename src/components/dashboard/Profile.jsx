import React, { useState, useEffect } from "react";
import {
  Upload,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";

const Profile = () => {
  // State variables
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeError, setResumeError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    bio: "",
    skills: [],
    experience: [],
    education: [],
    resumeUrl: "", // URL/path to the uploaded resume
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User is not authenticated");
        setLoading(true);

        const res = await fetch("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();

        setProfileData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          title: data.title || "",
          bio: data.bio || "",
          skills: Array.isArray(data.skills) ? data.skills : [],
          experience: Array.isArray(data.experience) ? data.experience : [],
          education: Array.isArray(data.education) ? data.education : [],
          resumeUrl: data.resumeUrl || "",
        });

        if (!data.firstName || !data.lastName || !data.email || !data.title) {
          setIsEditing(true);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.message || "Failed to load profile");
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  // Build the proper resume link href, prepend endpoint if needed
  const buildResumeHref = () => {
    if (!profileData?.resumeUrl) return "#";
    return profileData.resumeUrl.includes("/")
      ? profileData.resumeUrl
      : `/api/resumes/${profileData.resumeUrl}`;
  };

  // Handle profile input changes
  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  // Skills handlers
  const handleSkillAdd = (skill) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };
  const handleSkillRemove = (skill) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  // Experience handlers
  const handleExperienceAdd = (newExp) => {
    setProfileData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }));
  };
  const handleExperienceUpdate = (index, updatedExp) => {
    setProfileData((prev) => {
      const expCopy = [...prev.experience];
      expCopy[index] = updatedExp;
      return { ...prev, experience: expCopy };
    });
  };
  const handleExperienceRemove = (index) => {
    setProfileData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // Education handlers
  const handleEducationAdd = (newEdu) => {
    setProfileData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };
  const handleEducationUpdate = (index, updatedEdu) => {
    setProfileData((prev) => {
      const eduCopy = [...prev.education];
      eduCopy[index] = updatedEdu;
      return { ...prev, education: eduCopy };
    });
  };
  const handleEducationRemove = (index) => {
    setProfileData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Save profile (PUT request)
  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User is not authenticated");

      if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
        setError("First and Last name are required");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save profile");
      }

      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error(err);
    }
  };

  // Resume upload handler
  const handleResumeUpload = async () => {
    if (!resumeFile) return setResumeError("Please select a file.");
    setResumeUploading(true);
    setResumeError("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", resumeFile);

      const response = await fetch("/api/users/resume", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload resume");
      const resumeUrl = await response.text(); // assuming backend returns plain text URL

      setProfileData((prev) => ({ ...prev, resumeUrl }));
      setResumeFile(null);
    } catch (err) {
      setResumeError(err.message);
    } finally {
      setResumeUploading(false);
    }
  };

  // Loading and error UI
  if (loading) {
    return (
      <div className="p-8 text-center text-lg text-gray-700">Loading profile...</div>
    );
  }
  if (error && !isEditing) {
    return (
      <div className="p-8 text-center text-red-600 font-medium">{error}</div>
    );
  }

  // Render the full profile UI
  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
      {/* Header and Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <div>
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="mr-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                disabled={loading}
                type="button"
              >
                <X className="inline mr-1" /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={loading}
                type="button"
              >
                <Save className="inline mr-1" /> Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              type="button"
            >
              <Edit className="inline mr-1" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Personal Info Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=150&q=80"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            {isEditing && (
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                // TODO: Connect upload picture functionality
              >
                <Upload className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex-1 w-full max-w-md">
            {isEditing ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Job Title"
                  value={profileData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <textarea
                  rows={3}
                  placeholder="Bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-blue-600">{profileData.title}</p>
                <p className="mt-1 text-gray-700">{profileData.bio}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Skills</h3>
        {isEditing ? (
          <SkillsEditor
            skills={profileData.skills}
            onAdd={handleSkillAdd}
            onRemove={handleSkillRemove}
          />
        ) : (
          <div className="flex flex-wrap gap-2 max-w-lg">
            {profileData.skills.length === 0 && <p>No skills added</p>}
            {profileData.skills.map((skill, i) => (
              <span
                key={i}
                className="inline-block bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Experience and Education Sections */}
      <div className="mt-6">
        {isEditing ? (
          <>
            <ExperienceEditor
              experience={profileData.experience}
              onAdd={handleExperienceAdd}
              onUpdate={handleExperienceUpdate}
              onRemove={handleExperienceRemove}
            />
            <EducationEditor
              education={profileData.education}
              onAdd={handleEducationAdd}
              onUpdate={handleEducationUpdate}
              onRemove={handleEducationRemove}
            />
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-2">Experience</h3>
            {profileData.experience.length === 0 ? (
              <p>No experience added</p>
            ) : (
              profileData.experience.map((exp, i) => (
                <div key={i} className="mb-3 max-w-lg">
                  <p className="font-semibold">
                    {exp.role} at {exp.company}
                  </p>
                  <p className="text-sm text-gray-600">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </p>
                  <p>{exp.description}</p>
                </div>
              ))
            )}

            <h3 className="text-lg font-semibold mt-6 mb-2">Education</h3>
            {profileData.education.length === 0 ? (
              <p>No education added</p>
            ) : (
              profileData.education.map((edu, i) => (
                <div key={i} className="mb-3 max-w-lg">
                  <p className="font-semibold">
                    {edu.degree} at {edu.school}
                  </p>
                  <p className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </p>
                  <p>{edu.fieldOfStudy}</p>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* Resume Upload Section */}
      <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-4 mb-6 mt-4">
        <Upload className="text-blue-600 w-7 h-7" />
        <span className="flex-1">
          {profileData?.resumeUrl ? (
            <a
              href={buildResumeHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline"
            >
              View Uploaded Resume
            </a>
          ) : (
            "No resume uploaded"
          )}
        </span>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          id="resume-upload"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setResumeFile(e.target.files[0]);
              setResumeError("");
            }
          }}
          disabled={resumeUploading}
        />
        <label
          htmlFor="resume-upload"
          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Select Resume
        </label>

        {resumeFile && (
          <span className="ml-4 truncate max-w-xs" title={resumeFile.name}>
            Selected file: {resumeFile.name}
          </span>
        )}

        <button
          onClick={() => {
            if (resumeFile && !resumeUploading) {
              handleResumeUpload();
            } else {
              setResumeError("Please select a file.");
            }
          }}
          disabled={resumeUploading}
          className={`ml-4 px-4 py-2 rounded-lg ${
            resumeUploading
              ? "opacity-60 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
          type="button"
        >
          {resumeUploading ? "Uploading..." : "Upload Resume"}
        </button>
      </div>

      {resumeError && <div className="text-red-600">{resumeError}</div>}
    </div>
  );
};


// Helper Components Below

function SkillsEditor({ skills, onAdd, onRemove }) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onAdd(trimmed);
      setInputValue("");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <>
      <div className="flex max-w-lg gap-2 mb-3">
        <input
          type="text"
          placeholder="Add skill"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-grow px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
        >
          <Plus />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 max-w-lg">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="inline-flex items-center bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm"
          >
            {skill}
            <button
              type="button"
              onClick={() => onRemove(skill)}
              className="ml-1 hover:text-red-600"
              aria-label={`Remove skill ${skill}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </>
  );
}

function ExperienceEditor({ experience, onAdd, onUpdate, onRemove }) {
  const [newExp, setNewExp] = useState({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleChange = (field, value) => {
    setNewExp((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (!newExp.company.trim() || !newExp.role.trim()) {
      return;
    }
    onAdd(newExp);
    setNewExp({
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  return (
    <div className="max-w-lg">
      <h3 className="text-lg font-semibold mb-3">Experience</h3>
      {experience.length === 0 && <p>No experience added</p>}
      {experience.map((exp, i) => (
        <div
          key={i}
          className="border border-gray-300 rounded p-3 mb-3 relative"
        >
          <input
            type="text"
            placeholder="Company"
            value={exp.company}
            onChange={(e) => onUpdate(i, { ...exp, company: e.target.value })}
            className="w-full mb-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Role"
            value={exp.role}
            onChange={(e) => onUpdate(i, { ...exp, role: e.target.value })}
            className="w-full mb-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex gap-2 mb-1">
            <input
              type="month"
              placeholder="Start Date"
              value={exp.startDate}
              onChange={(e) =>
                onUpdate(i, { ...exp, startDate: e.target.value })
              }
              className="flex-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="month"
              placeholder="End Date"
              value={exp.endDate}
              onChange={(e) =>
                onUpdate(i, { ...exp, endDate: e.target.value })
              }
              className="flex-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <textarea
            rows={2}
            placeholder="Description"
            value={exp.description}
            onChange={(e) =>
              onUpdate(i, { ...exp, description: e.target.value })
            }
            className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 resize-none"
          />
          <button
            onClick={() => onRemove(i)}
            className="absolute top-1 right-1 text-red-600 hover:text-red-800"
            title="Remove experience"
            aria-label={`Remove experience at ${exp.company}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}

      <div className="border border-gray-300 rounded p-3">
        <h4 className="font-semibold mb-2">Add Experience</h4>
        <input
          type="text"
          placeholder="Company"
          value={newExp.company}
          onChange={(e) => handleChange("company", e.target.value)}
          className="w-full mb-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Role"
          value={newExp.role}
          onChange={(e) => handleChange("role", e.target.value)}
          className="w-full mb-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
        />
        <div className="flex gap-2 mb-1">
          <input
            type="month"
            placeholder="Start Date"
            value={newExp.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="flex-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="month"
            placeholder="End Date"
            value={newExp.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className="flex-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <textarea
          rows={2}
          placeholder="Description"
          value={newExp.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 resize-none mb-2"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          type="button"
        >
          <Plus className="inline mr-1" /> Add Experience
        </button>
      </div>
    </div>
  );
}

function EducationEditor({ education, onAdd, onUpdate, onRemove }) {
  const [newEdu, setNewEdu] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (field, value) => {
    setNewEdu((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (!newEdu.school.trim() || !newEdu.degree.trim()) {
      return;
    }
    onAdd(newEdu);
    setNewEdu({
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="max-w-lg mt-6">
      <h3 className="text-lg font-semibold mb-3">Education</h3>
      {education.length === 0 && <p>No education added</p>}
      {education.map((edu, i) => (
        <div
          key={i}
          className="border border-gray-300 rounded p-3 mb-3 relative"
        >
          <input
            type="text"
            placeholder="School"
            value={edu.school}
            onChange={(e) => onUpdate(i, { ...edu, school: e.target.value })}
            className="w-full mb-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Degree"
            value={edu.degree}
            onChange={(e) => onUpdate(i, { ...edu, degree: e.target.value })}
            className="w-full mb-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Field of Study"
            value={edu.fieldOfStudy}
            onChange={(e) =>
              onUpdate(i, { ...edu, fieldOfStudy: e.target.value })
            }
            className="w-full mb-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex gap-2 mb-1">
            <input
              type="month"
              placeholder="Start Date"
              value={edu.startDate}
              onChange={(e) => onUpdate(i, { ...edu, startDate: e.target.value })}
              className="flex-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="month"
              placeholder="End Date"
              value={edu.endDate}
              onChange={(e) => onUpdate(i, { ...edu, endDate: e.target.value })}
              className="flex-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => onRemove(i)}
            className="absolute top-1 right-1 text-red-600 hover:text-red-800"
            title="Remove education"
            aria-label={`Remove education from ${edu.school}`}
            type="button"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}

      <div className="border border-gray-300 rounded p-3">
        <h4 className="font-semibold mb-2">Add Education</h4>
        <input
          type="text"
          placeholder="School"
          value={newEdu.school}
          onChange={(e) => handleChange("school", e.target.value)}
          className="w-full mb-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Degree"
          value={newEdu.degree}
          onChange={(e) => handleChange("degree", e.target.value)}
          className="w-full mb-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Field of Study"
          value={newEdu.fieldOfStudy}
          onChange={(e) => handleChange("fieldOfStudy", e.target.value)}
          className="w-full mb-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
        />
        <div className="flex gap-2 mb-1">
          <input
            type="month"
            placeholder="Start Date"
            value={newEdu.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="flex-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="month"
            placeholder="End Date"
            value={newEdu.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className="flex-1 px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          type="button"
        >
          <Plus className="inline mr-1" /> Add Education
        </button>
      </div>
    </div>
  );
}

export default Profile;
