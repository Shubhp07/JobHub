import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Search, Users, Shield, Zap, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    id: 'feature-1',
    icon: Search,
    title: 'Smart Job Matching',
    description:
      'Our AI-powered algorithm matches you with jobs that perfectly fit your skills and preferences.',
    image: '/spence_ai_match.png',
  },
  {
    id: 'feature-2',
    icon: Users,
    title: 'Top Companies',
    description:
      'Connect with leading companies and startups that are actively hiring talented professionals.',
    image: '/spence_career_growth.png',
  },
  {
    id: 'feature-3',
    icon: Shield,
    title: 'Secure & Private',
    description:
      'Your personal information is protected with enterprise-grade security and privacy controls.',
    image: '/spence_dashboard_charts.png',
  },
  {
    id: 'feature-4',
    icon: Zap,
    title: 'Quick Applications',
    description:
      'Apply to multiple jobs with one click using your saved profile and customized resumes.',
    image: '/spence_apply_button.png',
  },
  {
    id: 'feature-5',
    icon: Target,
    title: 'Career Guidance',
    description:
      'Get personalized career advice and insights to help you make informed decisions.',
    image: '/spence_minimal_match.png',
  },
  {
    id: 'feature-6',
    icon: Award,
    title: 'Success Tracking',
    description:
      'Track your application progress and get feedback to improve your job search strategy.',
    image: '/spence_minimal_track.png',
  },
];

const CARD_WIDTH = 340;
const CARD_GAP = 24;

const Features = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [dragX, setDragX] = useState(0);
  const xRef = useRef(0);

  // Calculate drag constraints based on track width vs container width
  const updateConstraints = useCallback(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const container = track.parentElement;
    if (!container) return;

    const trackWidth = track.scrollWidth;
    const containerWidth = container.clientWidth;
    const maxDrag = -(trackWidth - containerWidth);

    setConstraints({ left: maxDrag, right: 0 });
  }, []);

  useEffect(() => {
    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [updateConstraints]);

  // Update button states based on current drag position
  const updateScrollButtons = useCallback(
    (x) => {
      setCanScrollPrev(x < -5);
      setCanScrollNext(x > constraints.left + 5);
    },
    [constraints.left]
  );

  useEffect(() => {
    updateScrollButtons(dragX);
  }, [dragX, updateScrollButtons]);

  // Scroll prev/next by one card width
  const scrollPrev = () => {
    const newX = Math.min(xRef.current + CARD_WIDTH + CARD_GAP, 0);
    xRef.current = newX;
    setDragX(newX);
  };

  const scrollNext = () => {
    const newX = Math.max(xRef.current - CARD_WIDTH - CARD_GAP, constraints.left);
    xRef.current = newX;
    setDragX(newX);
  };

  // GSAP scroll-triggered entry animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section header
      gsap.fromTo(
        '.features-header',
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
            toggleActions: 'play none none none',
          },
        }
      );

      // Staggered cards reveal
      gsap.fromTo(
        '.feature-carousel-card',
        { opacity: 0, y: 50, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.features-track',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-24 md:py-28 bg-spencePrimary border-t border-[#1e3d4c] relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-spenceSecondary/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header + Navigation */}
        <div className="features-header opacity-0 mb-10 md:mb-14 lg:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-serif text-white leading-relaxed">
              Why Choose JobHub?{' '}
              <span className="text-slate-400 text-sm sm:text-base lg:text-xl font-sans font-normal">
                We provide everything you need to find your dream job and advance your career
              </span>
            </h2>
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous feature"
              className="h-10 w-10 rounded-full border border-[#1e3d4c] bg-spenceCard flex items-center justify-center text-white transition-all hover:border-spenceSecondary/50 hover:bg-[#1e3d4c] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next feature"
              className="h-10 w-10 rounded-full border border-[#1e3d4c] bg-spenceCard flex items-center justify-center text-white transition-all hover:border-spenceSecondary/50 hover:bg-[#1e3d4c] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="w-full overflow-hidden">
          <motion.div
            ref={trackRef}
            className="features-track flex cursor-grab active:cursor-grabbing"
            style={{ gap: `${CARD_GAP}px` }}
            drag="x"
            dragConstraints={constraints}
            dragElastic={0.1}
            dragMomentum={true}
            animate={{ x: dragX }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onDrag={(_, info) => {
              xRef.current = info.point.x !== undefined ? dragX + info.offset.x : dragX;
            }}
            onDragEnd={(_, info) => {
              const newX = Math.max(
                constraints.left,
                Math.min(0, dragX + info.offset.x)
              );
              xRef.current = newX;
              setDragX(newX);
            }}
          >
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="feature-carousel-card opacity-0 flex-shrink-0"
                  style={{ width: `${CARD_WIDTH}px` }}
                >
                  <div className="group relative w-full h-[300px] md:h-[380px] rounded-2xl overflow-hidden border border-[#1e3d4c] bg-spenceCard shadow-lg hover:shadow-[0_15px_40px_rgba(254,85,50,0.08)] transition-shadow duration-500 select-none">
                    {/* Image — fills card, shrinks to top half on hover */}
                    <div className="relative h-full w-full transition-all duration-500 ease-in-out group-hover:h-1/2">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="h-full w-full object-cover object-center"
                        draggable={false}
                      />
                      {/* Icon badge */}
                      <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-spencePrimary/70 backdrop-blur-sm border border-[#1e3d4c]/60 text-spenceSecondary transition-transform duration-300 group-hover:scale-110">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      {/* Gradient fade at bottom of image */}
                      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-spencePrimary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Text reveal panel — slides up from bottom on hover */}
                    <div className="absolute bottom-0 left-0 w-full h-0 group-hover:h-1/2 transition-all duration-500 ease-in-out flex flex-col justify-center px-5 py-0 group-hover:py-5 bg-spenceCard/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 overflow-hidden">
                      <h3 className="text-lg font-bold font-serif text-white mb-2 group-hover:text-spenceSecondary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 group-hover:text-slate-300 transition-colors duration-300">
                        {feature.description}
                      </p>
                      {/* Arrow button */}
                      <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full border border-[#1e3d4c] bg-spencePrimary/60 flex items-center justify-center text-spenceSecondary transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-spenceSecondary/40">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;