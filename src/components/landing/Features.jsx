import React, { useEffect, useRef } from 'react';
import { Search, Users, Shield, Zap, Target, Award } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Search,
    title: 'Smart Job Matching',
    description: 'Our AI-powered algorithm matches you with jobs that perfectly fit your skills and preferences.',
  },
  {
    icon: Users,
    title: 'Top Companies',
    description: 'Connect with leading companies and startups that are actively hiring talented professionals.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your personal information is protected with enterprise-grade security and privacy controls.',
  },
  {
    icon: Zap,
    title: 'Quick Applications',
    description: 'Apply to multiple jobs with one click using your saved profile and customized resumes.',
  },
  {
    icon: Target,
    title: 'Career Guidance',
    description: 'Get personalized career advice and insights to help you make informed decisions.',
  },
  {
    icon: Award,
    title: 'Success Tracking',
    description: 'Track your application progress and get feedback to improve your job search strategy.',
  }
];

const Features = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section header
      gsap.fromTo('.features-header', 
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
      gsap.fromTo('.feature-card', 
        { opacity: 0, y: 60, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.features-grid',
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
      id="features"
      ref={sectionRef}
      className="py-28 bg-spencePrimary border-t border-[#1e3d4c] relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-spenceSecondary/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="features-header text-center mb-20 opacity-0">
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-4">
            Why Choose JobHub?
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            We provide everything you need to find your dream job and advance your career
          </p>
        </div>

        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="feature-card opacity-0 group bg-spenceCard border border-[#1e3d4c] rounded-2xl p-8 hover:border-spenceSecondary/40 transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-[0_15px_30px_rgba(254,85,50,0.06)] flex flex-col items-start text-left"
              >
                <div className="inline-flex p-4 rounded-2xl bg-spenceSecondary/10 text-spenceSecondary mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <IconComponent className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold font-serif text-white mb-3 group-hover:text-spenceSecondary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed transition-colors duration-300 group-hover:text-slate-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;