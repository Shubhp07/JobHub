import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

const Hero = () => {
  const titleRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Animate title with a subtle scale + slide-up + overshoot back ease
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 90, scale: 0.96 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 1.2, 
        ease: 'back.out(1.4)' 
      }
    );

    // Fade in the CTA button slightly before the title animation finishes
    tl.fromTo(
      btnRef.current,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: 'power2.out' 
      },
      '-=0.6'
    );
  }, []);

  return (
    <section 
      className="relative min-h-screen flex items-end pb-24 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/spence_hero.png')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/35"></div>

      {/* Dotted Grid Overlay */}
      <div className="absolute right-[12%] top-1/3 grid grid-cols-10 gap-3.5 opacity-90 hidden md:grid">
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-spenceSecondary cursor-pointer"
            whileHover={{
              scale: 2.2,
              backgroundColor: '#ffffff',
              boxShadow: '0 0 10px #FE5532',
            }}
            transition={{ type: 'spring', stiffness: 450, damping: 15 }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full z-10">
        <div className="max-w-2xl text-left">
          <h1 
            ref={titleRef}
            className="text-6xl md:text-8xl font-bold font-serif text-white mb-8 tracking-tight leading-tight opacity-0 select-none"
          >
            Current<br />Vacancies
          </h1>
          
          <div ref={btnRef} className="opacity-0">
            <Link 
              to="/dashboard/jobseeker"
              className="bg-transparent border border-white hover:border-spenceSecondary text-white hover:text-spenceSecondary font-serif font-bold rounded-full py-2.5 pl-6 pr-3 inline-flex items-center gap-4 transition-all group"
            >
              Our Jobs
              <span className="bg-spenceSecondary group-hover:bg-[#e04523] rounded-full p-1.5 flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4 text-white" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;