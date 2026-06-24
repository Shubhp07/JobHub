import React, { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    company: 'Google',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'JobHub helped me land my dream job at Google. The platform\'s smart matching feature connected me with opportunities I never would have found otherwise.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Product Manager',
    company: 'Microsoft',
    image: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'The application process was seamless, and I received multiple offers within weeks. JobHub truly understands what both candidates and employers need.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    company: 'Airbnb',
    image: 'https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'As a designer, I appreciated how JobHub showcased my portfolio effectively. The platform helped me connect with companies that valued creativity.',
    rating: 5
  }
];

const Testimonials = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo('.testimonials-header', 
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
      gsap.fromTo('.testimonial-card', 
        { opacity: 0, y: 50, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.testimonials-grid',
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
        <div className="testimonials-header text-center mb-20 opacity-0">
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Hear from professionals who found their dream jobs through JobHub
          </p>
        </div>

        <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card opacity-0 bg-spenceCard border border-[#1e3d4c] rounded-2xl p-8 hover:border-spenceSecondary/40 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-spenceSecondary/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <div className="relative mb-6">
                  <Quote className="absolute -top-3 -left-3 h-8 w-8 text-spenceSecondary/15" />
                  <p className="text-slate-300 leading-relaxed pl-6 text-sm">
                    {testimonial.content}
                  </p>
                </div>
              </div>

              <div className="flex items-center pt-4 border-t border-[#1e3d4c]/50">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 border border-[#1e3d4c]"
                />
                <div>
                  <h4 className="font-bold font-serif text-white">{testimonial.name}</h4>
                  <p className="text-slate-400 text-xs">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;