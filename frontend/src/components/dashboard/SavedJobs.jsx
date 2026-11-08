import React, { useState } from 'react';
import { 
  Bookmark, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star,
  Trash2,
  ExternalLink,
  Filter
} from 'lucide-react';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechFlow Solutions',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $150k',
      savedDate: '2024-01-15',
      logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
      tags: ['React', 'TypeScript', 'Node.js'],
      description: 'We are looking for a Senior React Developer to join our growing team and help build the next generation of web applications.',
      match: '95%',
      urgent: true
    },
    {
      id: 2,
      title: 'Frontend Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100k - $130k',
      savedDate: '2024-01-14',
      logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
      tags: ['Vue.js', 'JavaScript', 'CSS'],
      description: 'Join our innovative team as a Frontend Engineer and help build cutting-edge user interfaces.',
      match: '88%',
      urgent: false
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'Digital Innovations',
      location: 'New York, NY',
      type: 'Contract',
      salary: '$80 - $100/hr',
      savedDate: '2024-01-12',
      logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
      tags: ['React', 'Python', 'AWS'],
      description: 'We need a Full Stack Developer for a 6-month contract project building a modern web platform.',
      match: '82%',
      urgent: false
    },
    {
      id: 4,
      title: 'JavaScript Developer',
      company: 'WebCraft Agency',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$90k - $110k',
      savedDate: '2024-01-10',
      logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
      tags: ['JavaScript', 'React', 'MongoDB'],
      description: 'Looking for a passionate JavaScript Developer to work on exciting client projects.',
      match: '79%',
      urgent: false
    }
  ]);

  const [sortBy, setSortBy] = useState('newest');

  const handleRemoveJob = (jobId) => {
    setSavedJobs(savedJobs.filter(job => job.id !== jobId));
  };

  const sortedJobs = [...savedJobs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.savedDate) - new Date(a.savedDate);
      case 'oldest':
        return new Date(a.savedDate) - new Date(b.savedDate);
      case 'match':
        return parseInt(b.match) - parseInt(a.match);
      case 'salary':
        const getSalaryValue = (salary) => {
          const match = salary.match(/\$(\d+)k/);
          return match ? parseInt(match[1]) : 0;
        };
        return getSalaryValue(b.salary) - getSalaryValue(a.salary);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
          <p className="text-gray-600">Jobs you've bookmarked for later</p>
        </div>
        <div className="text-sm text-gray-500">
          {savedJobs.length} saved jobs
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="match">Best Match</option>
              <option value="salary">Highest Salary</option>
            </select>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Clear All Saved Jobs
          </button>
        </div>
      </div>

      {/* Saved Jobs List */}
      {sortedJobs.length > 0 ? (
        <div className="space-y-4">
          {sortedJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={job.logo}
                    alt={job.company}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                        {job.title}
                      </h3>
                      {job.urgent && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          Urgent
                        </span>
                      )}
                      <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        <Star className="h-3 w-3 mr-1" />
                        {job.match} match
                      </div>
                    </div>
                    <p className="text-gray-600 font-medium mb-2">{job.company}</p>
                    <div className="flex items-center text-sm text-gray-600 space-x-4 mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.type}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{job.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveJob(job.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-2"
                  title="Remove from saved jobs"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  Saved on {new Date(job.savedDate).toLocaleDateString()}
                </span>
                <div className="flex space-x-3">
                  <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs yet</h3>
          <p className="text-gray-600 mb-6">
            Start saving jobs you're interested in to keep track of opportunities.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Browse Jobs
          </button>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;