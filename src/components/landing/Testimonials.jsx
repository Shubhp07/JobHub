import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Twitter,
  Youtube,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Michael Chen",
    title: "Senior Software Engineer, Cloud Infrastructure",
    description:
      "Working with this team completely changed our infrastructure game. The support and expertise were incredible. They delivered beyond our expectations and helped us scale to millions of users.",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1689977807477-a579eda91fa2?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    githubUrl: "#",
    twitterUrl: "#",
    youtubeUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "Jessica Roberts",
    title: "Lead Data Scientist, InsightX",
    description:
      "The data analytics platform they built gave our team the confidence and tools needed for true data-driven decisions. Their dashboarding capabilities went above and beyond our expectations.",
    imageUrl:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=600&q=80",
    githubUrl: "#",
    twitterUrl: "#",
    youtubeUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "William Carter",
    title: "VP Product, NovaLabs",
    description:
      "NovaLabs helped our products find the perfect market fit. Their engineering team exceeded every delivery milestone and provided exceptional technical leadership.",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    githubUrl: "#",
    twitterUrl: "#",
    youtubeUrl: "#",
    linkedinUrl: "#",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        ".testimonials-header",
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Create the pin/scroll trigger
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          let index = 0;
          if (progress > 0.35 && progress <= 0.7) {
            index = 1;
          } else if (progress > 0.7) {
            index = 2;
          }

          setCurrentIndex((prev) => {
            if (prev !== index) {
              return index;
            }
            return prev;
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToTestimonial = (index) => {
    if (!scrollTriggerRef.current) return;

    const trigger = scrollTriggerRef.current;
    const start = trigger.start;
    const end = trigger.end;
    const totalDist = end - start;

    // Define target progress ranges for each card
    let targetProgress = 0.15;
    if (index === 1) targetProgress = 0.52;
    if (index === 2) targetProgress = 0.85;

    const targetScroll = start + targetProgress * totalDist;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % testimonials.length;
    scrollToTestimonial(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    scrollToTestimonial(prevIndex);
  };

  const currentTestimonial = testimonials[currentIndex];

  const socialIcons = [
    { icon: Github, url: currentTestimonial.githubUrl, label: "GitHub" },
    { icon: Twitter, url: currentTestimonial.twitterUrl, label: "Twitter" },
    { icon: Youtube, url: currentTestimonial.youtubeUrl, label: "YouTube" },
    { icon: Linkedin, url: currentTestimonial.linkedinUrl, label: "LinkedIn" },
  ];

  return (
    <section
      ref={sectionRef}
      className="pin-section w-full h-screen bg-spencePrimary border-t border-[#1e3d4c] relative overflow-hidden font-sans flex flex-col justify-center"
    >
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-spenceSecondary/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-spenceSecondary/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Header */}
        <div className="testimonials-header text-center mb-10 md:mb-16 opacity-0">
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-3">
            Success Stories
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            Hear from professionals who found their dream jobs through JobHub
          </p>
        </div>

        {/* Carousel Container */}
        <div className="w-full max-w-5xl mx-auto px-4">
          {/* Desktop layout */}
          <div className="hidden md:flex relative items-center min-h-[470px]">
            {/* Avatar */}
            <div className="w-[470px] h-[470px] rounded-3xl overflow-hidden bg-spenceCard border border-[#1e3d4c] flex-shrink-0 shadow-2xl relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial.imageUrl}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full h-full"
                >
                  <img
                    src={currentTestimonial.imageUrl}
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Card */}
            <div className="bg-[#132b36]/90 backdrop-blur-md border border-[#1e3d4c] rounded-3xl shadow-2xl p-10 ml-[-80px] z-10 max-w-xl flex-1 relative min-h-[380px] flex flex-col justify-between">
              <Quote className="absolute top-6 right-8 h-16 w-16 text-spenceSecondary/10 pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex flex-col h-full justify-between"
                >
                  <div className="mb-6">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold font-serif text-white mb-1">
                        {currentTestimonial.name}
                      </h3>
                      <p className="text-sm font-medium text-spenceSecondary">
                        {currentTestimonial.title}
                      </p>
                    </div>

                    <p className="text-slate-300 text-base leading-relaxed">
                      "{currentTestimonial.description}"
                    </p>
                  </div>

                  <div className="flex space-x-4 pt-4 border-t border-[#1e3d4c]/50">
                    {socialIcons.map(({ icon: IconComponent, url, label }) => (
                      <a
                        key={label}
                        href={url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 bg-[#1e3d4c]/60 border border-[#1e3d4c] rounded-full flex items-center justify-center transition-all hover:bg-spenceSecondary hover:text-white hover:scale-105 cursor-pointer text-slate-300"
                        aria-label={label}
                      >
                        <IconComponent className="w-4.5 h-4.5" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="md:hidden max-w-sm mx-auto text-center">
            {/* Avatar */}
            <div className="w-full aspect-square bg-spenceCard border border-[#1e3d4c] rounded-3xl overflow-hidden mb-6 relative shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial.imageUrl}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full h-full"
                >
                  <img
                    src={currentTestimonial.imageUrl}
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Card content */}
            <div className="bg-[#132b36]/80 backdrop-blur-md border border-[#1e3d4c] rounded-3xl p-6 relative shadow-lg">
              <Quote className="absolute top-4 right-6 h-10 w-10 text-spenceSecondary/10 pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <h3 className="text-xl font-bold font-serif text-white mb-1">
                    {currentTestimonial.name}
                  </h3>

                  <p className="text-xs font-medium text-spenceSecondary mb-4">
                    {currentTestimonial.title}
                  </p>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    "{currentTestimonial.description}"
                  </p>

                  <div className="flex justify-center space-x-3 pt-4 border-t border-[#1e3d4c]/50">
                    {socialIcons.map(({ icon: IconComponent, url, label }) => (
                      <a
                        key={label}
                        href={url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-[#1e3d4c]/60 border border-[#1e3d4c] rounded-full flex items-center justify-center transition-all hover:bg-spenceSecondary hover:text-white cursor-pointer text-slate-300"
                        aria-label={label}
                      >
                        <IconComponent className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom navigation */}
          <div className="flex justify-center items-center gap-6 mt-12">
            {/* Previous */}
            <button
              onClick={handlePrevious}
              aria-label="Previous testimonial"
              className="w-12 h-12 rounded-full bg-spenceCard border border-[#1e3d4c] shadow-md flex items-center justify-center hover:bg-[#1e3d4c] hover:border-spenceSecondary/50 transition-all cursor-pointer text-white active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="flex gap-2.5">
              {testimonials.map((_, testimonialIndex) => (
                <button
                  key={testimonialIndex}
                  onClick={() => scrollToTestimonial(testimonialIndex)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                    testimonialIndex === currentIndex
                      ? "bg-spenceSecondary scale-125 shadow-[0_0_8px_rgba(254,85,50,0.6)]"
                      : "bg-slate-600 hover:bg-slate-500"
                  )}
                  aria-label={`Go to testimonial ${testimonialIndex + 1}`}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="w-12 h-12 rounded-full bg-spenceCard border border-[#1e3d4c] shadow-md flex items-center justify-center hover:bg-[#1e3d4c] hover:border-spenceSecondary/50 transition-all cursor-pointer text-white active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}