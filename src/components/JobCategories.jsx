import React from 'react';
import { Code, Palette, TrendingUp, Shield, Stethoscope, GraduationCap, Wrench, Users } from 'lucide-react';

const categories = [
  { name: 'Technology', icon: Code, jobs: '12,500+', color: 'bg-blue-100 text-blue-600' },
  { name: 'Design', icon: Palette, jobs: '3,200+', color: 'bg-purple-100 text-purple-600' },
  { name: 'Marketing', icon: TrendingUp, jobs: '5,800+', color: 'bg-green-100 text-green-600' },
  { name: 'Finance', icon: Shield, jobs: '4,100+', color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Healthcare', icon: Stethoscope, jobs: '7,300+', color: 'bg-red-100 text-red-600' },
  { name: 'Education', icon: GraduationCap, jobs: '2,900+', color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Engineering', icon: Wrench, jobs: '8,700+', color: 'bg-orange-100 text-orange-600' },
  { name: 'Human Resources', icon: Users, jobs: '1,800+', color: 'bg-pink-100 text-pink-600' },
];

const JobCategories = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse Jobs by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore opportunities across various industries and find the perfect match for your skills
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer"
              >
                <div className={`inline-flex p-3 rounded-lg ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.jobs} available jobs</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JobCategories;