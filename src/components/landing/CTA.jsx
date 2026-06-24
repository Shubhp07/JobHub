import React, { useEffect, useRef } from 'react';
import { ArrowRight, Users, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CTA = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo('.cta-header', 
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
      gsap.fromTo('.cta-card', 
        { opacity: 0, y: 50, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.cta-cards',
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
      {/* Subtle background glow */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-spenceSecondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center text-white">
          <div className="cta-header opacity-0 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4">
              Ready to Take the Next Step?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Join thousands of professionals who have found their perfect job match through JobHub
            </p>
          </div>

          <div className="cta-cards grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* For Job Seekers */}
            <div className="cta-card opacity-0 bg-spenceCard border border-[#1e3d4c] rounded-2xl p-8 hover:border-spenceSecondary/40 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-spenceSecondary/5 text-center flex flex-col justify-between items-center">
              <div className="flex flex-col items-center">
                <div className="bg-spenceSecondary/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-spenceSecondary" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-white mb-4">For Job Seekers</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
                  Create your profile, upload your resume, and get matched with your ideal job opportunities.
                </p>
              </div>
              <Link 
                to="/dashboard/jobseeker"
                className="bg-transparent border border-white hover:border-spenceSecondary text-white hover:text-spenceSecondary font-serif font-bold rounded-full py-2.5 pl-6 pr-3 inline-flex items-center gap-4 transition-all group"
              >
                Get Started
                <span className="bg-spenceSecondary group-hover:bg-[#e04523] rounded-full p-1.5 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4 text-white" />
                </span>
              </Link>
            </div>

            {/* For Employers */}
            <div className="cta-card opacity-0 bg-spenceCard border border-[#1e3d4c] rounded-2xl p-8 hover:border-spenceSecondary/40 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-spenceSecondary/5 text-center flex flex-col justify-between items-center">
              <div className="flex flex-col items-center">
                <div className="bg-spenceSecondary/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Briefcase className="h-8 w-8 text-spenceSecondary" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-white mb-4">For Employers</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
                  Post jobs, find qualified candidates, and build your dream team with our powerful hiring tools.
                </p>
              </div>
              <Link 
                to="/signin"
                className="bg-spenceSecondary hover:bg-[#e04523] text-white font-serif font-bold rounded-full py-2.5 pl-6 pr-3 inline-flex items-center gap-4 transition-all group"
              >
                Post a Job
                <span className="bg-white rounded-full p-1.5 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4 text-spenceSecondary" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;