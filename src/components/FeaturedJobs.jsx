import React from 'react';
import { MapPin, Clock, DollarSign, Bookmark } from 'lucide-react';

const jobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $150k',
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    tags: ['React', 'TypeScript', 'Remote'],
    posted: '2 days ago'
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'InnovateLab',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$100k - $130k',
    logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    tags: ['Strategy', 'Analytics', 'Leadership'],
    posted: '1 day ago'
  },
  {
    id: 3,
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'Austin, TX',
    type: 'Contract',
    salary: '$80k - $100k',
    logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    tags: ['Figma', 'Prototyping', 'User Research'],
    posted: '3 days ago'
  },
  {
    id: 4,
    title: 'Data Scientist',
    company: 'DataFlow Analytics',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$110k - $140k',
    logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    tags: ['Python', 'Machine Learning', 'SQL'],
    posted: '1 week ago'
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Denver, CO',
    type: 'Full-time',
    salary: '$95k - $125k',
    logo: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    tags: ['AWS', 'Docker', 'Kubernetes'],
    posted: '4 days ago'
  },
  {
    id: 6,
    title: 'Marketing Manager',
    company: 'GrowthHackers',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    salary: '$75k - $95k',
    logo: 'https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    tags: ['Digital Marketing', 'SEO', 'Content'],
    posted: '5 days ago'
  }
];

const FeaturedJobs = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Jobs
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hand-picked opportunities from top companies looking for talented professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={job.logo}
                    alt={job.company}
                    className="w-12 h-12 rounded-lg object-cover mr-3"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{job.company}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  {job.type}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {job.salary}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">{job.posted}</span>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
            View All Jobs
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;