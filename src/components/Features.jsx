import React from 'react';
import { Search, Users, Shield, Zap, Target, Award } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Smart Job Matching',
    description: 'Our AI-powered algorithm matches you with jobs that perfectly fit your skills and preferences.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Users,
    title: 'Top Companies',
    description: 'Connect with leading companies and startups that are actively hiring talented professionals.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your personal information is protected with enterprise-grade security and privacy controls.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Zap,
    title: 'Quick Applications',
    description: 'Apply to multiple jobs with one click using your saved profile and customized resumes.',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    icon: Target,
    title: 'Career Guidance',
    description: 'Get personalized career advice and insights to help you make informed decisions.',
    color: 'bg-red-100 text-red-600'
  },
  {
    icon: Award,
    title: 'Success Tracking',
    description: 'Track your application progress and get feedback to improve your job search strategy.',
    color: 'bg-indigo-100 text-indigo-600'
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose JobHub?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide everything you need to find your dream job and advance your career
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group text-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                <div className={`inline-flex p-4 rounded-2xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;