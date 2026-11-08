import React, { useEffect, useRef } from 'react';
import { Code, Palette, TrendingUp, Shield, Stethoscope, GraduationCap, Wrench, Users } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { name: 'Technology', icon: Code, jobs: '12,500+' },
  { name: 'Design', icon: Palette, jobs: '3,200+' },
  { name: 'Marketing', icon: TrendingUp, jobs: '5,800+' },
  { name: 'Finance', icon: Shield, jobs: '4,100+' },
  { name: 'Healthcare', icon: Stethoscope, jobs: '7,300+' },
  { name: 'Education', icon: GraduationCap, jobs: '2,900+' },
  { name: 'Engineering', icon: Wrench, jobs: '8,700+' },
  { name: 'Human Resources', icon: Users, jobs: '1,800+' },
];

const JobCategories = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo('.categories-header', 
        { opacity: 0, y: 40, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Staggered cards reveal
      gsap.fromTo('.category-card', 
        { opacity: 0, y: 50, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.categories-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-spencePrimary border-t border-[#1e3d4c] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="categories-header text-center mb-20 opacity-0">
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-4">
            Browse Jobs by Category
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Explore opportunities across various industries and find the perfect match for your skills
          </p>
        </div>

        <div className="categories-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                className="category-card opacity-0 group bg-spenceCard border border-[#1e3d4c] rounded-2xl p-6 hover:border-spenceSecondary/40 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-spenceSecondary/5 cursor-pointer"
              >
                <div className="inline-flex p-3 rounded-xl bg-spenceSecondary/10 text-spenceSecondary mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold font-serif text-white mb-2">{category.name}</h3>
                <p className="text-slate-400 text-sm">{category.jobs} available jobs</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JobCategories;