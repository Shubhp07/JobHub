import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Precision Matching",
    description:
      "Our advanced AI matching engine scans your experience and connects you with ideal vacancies automatically.",
    image: "/spence_match_photo.png",
  },
  {
    number: "02",
    title: "Tailored Opportunities",
    description:
      "Filter through curated vacancies tailored to your skillset, salary expectations, and preferences.",
    image: "/spence_search_photo.png",
  },
  {
    number: "03",
    title: "Direct Submission",
    description:
      "Submit your details directly to decision-makers with a seamless, one-click application process.",
    image: "/spence_submit_photo.png",
  },
  {
    number: "04",
    title: "Milestone Tracking",
    description:
      "Monitor status updates, interview schedules, and application feedback in real-time.",
    image: "/spence_track_photo.png",
  },
];

const HowItWorks = () => {
  const pinSectionRef = useRef(null);
  const listRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const listItems = gsap.utils.toArray("li", listRef.current);
      const slides = gsap.utils.toArray(".slide", pinSectionRef.current);

      let mm = gsap.matchMedia();

      // Desktop pinning animation
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinSectionRef.current,
            start: "top top",
            end: `+=${listItems.length * 100}%`,
            pin: true,
            scrub: 1.5,
          },
        });

        // Set transform origins
        gsap.set(".step-title", { transformOrigin: "left center" });
        gsap.set(".step-num", { transformOrigin: "left center" });

        // Initialize all steps' styling
        listItems.forEach((item, i) => {
          const titleElement = item.querySelector(".step-title");
          const descElement = item.querySelector(".step-desc");
          const numElement = item.querySelector(".step-num");

          if (i > 0) {
            gsap.set(descElement, { height: 0, opacity: 0, marginTop: 0 });
            gsap.set(titleElement, { color: "#475569", scale: 0.85, y: 10 });
            gsap.set(numElement, { color: "#334155", scale: 0.85 });
            // Place non-active slides offscreen below
            gsap.set(slides[i], { y: "100%", opacity: 1, visibility: "visible" });
          } else {
            gsap.set(titleElement, { color: "#FE5532", scale: 1.1, y: 0 });
            gsap.set(numElement, { color: "#FE5532", scale: 1.1 });
            gsap.set(descElement, { height: "auto", opacity: 1, marginTop: 8 });
            // Place active slide centered on screen
            gsap.set(slides[i], { y: "0%", opacity: 1, visibility: "visible" });
          }
        });

        // Set initial scale and transform origin for progress fill
        gsap.set(fillRef.current, {
          scaleY: 1 / listItems.length,
          transformOrigin: "top left",
        });

        // Build transition timeline
        listItems.forEach((item, i) => {
          if (i === 0) return;

          const titleElement = item.querySelector(".step-title");
          const descElement = item.querySelector(".step-desc");
          const numElement = item.querySelector(".step-num");

          const previousItem = listItems[i - 1];
          const prevTitle = previousItem.querySelector(".step-title");
          const prevDesc = previousItem.querySelector(".step-desc");
          const prevNum = previousItem.querySelector(".step-num");

          tl.to(
            titleElement,
            {
              color: "#FE5532",
              scale: 1.1,
              y: 0,
              ease: "power3.out",
              duration: 0.6,
            },
            0.6 * i,
          )
            .to(
              numElement,
              {
                color: "#FE5532",
                scale: 1.1,
                ease: "power3.out",
                duration: 0.6,
              },
              "<",
            )
            .to(
              descElement,
              { height: "auto", opacity: 1, marginTop: 8, duration: 0.6 },
              "<",
            )
            // Slide the incoming background up to the screen center
            .to(slides[i], { y: "0%", ease: "power3.inOut", duration: 0.6 }, "<")
            // Slide the previous background up and offscreen to the top
            .to(slides[i - 1], { y: "-100%", ease: "power3.inOut", duration: 0.6 }, "<")

            .to(
              prevTitle,
              {
                color: "#475569",
                scale: 0.85,
                y: 10,
                ease: "power3.inOut",
                duration: 0.6,
              },
              0.6 * i,
            )
            .to(
              prevNum,
              {
                color: "#334155",
                scale: 0.85,
                ease: "power3.inOut",
                duration: 0.6,
              },
              "<",
            )
            .to(
              prevDesc,
              { height: 0, opacity: 0, marginTop: 0, duration: 0.6 },
              "<",
            );
        });

        // Complete progress bar fill animation in sync
        tl.to(
          fillRef.current,
          {
            scaleY: 1,
            transformOrigin: "top left",
            ease: "none",
            duration: tl.duration(),
          },
          0,
        ).to({}, {}); // short pause at end
      });

      // Mobile / Tablet normal behavior (reset styles)
      mm.add("(max-width: 1023px)", () => {
        listItems.forEach((item) => {
          const titleElement = item.querySelector(".step-title");
          const descElement = item.querySelector(".step-desc");
          const numElement = item.querySelector(".step-num");

          gsap.set(titleElement, { clearProps: "all" });
          gsap.set(descElement, { clearProps: "all" });
          gsap.set(numElement, { clearProps: "all" });
        });
        slides.forEach((slide) => {
          gsap.set(slide, { clearProps: "all" });
        });
        gsap.set(fillRef.current, { clearProps: "all" });
      });

    }, pinSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={pinSectionRef}
      className="pin-section w-full lg:h-screen bg-spencePrimary border-t border-b border-[#1e3d4c] flex items-center justify-start lg:overflow-hidden relative py-16 lg:py-0"
    >
      {/* Full Page Slides Background (Desktop Only) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden hidden lg:block">
        {steps.map((step, index) => (
          <div
            key={index}
            className="slide absolute inset-0 w-full h-full"
          >
            <img
              src={step.image}
              alt={step.title}
              className="w-full h-full object-cover"
            />
            {/* Subtle gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E232D]/70 via-[#0E232D]/35 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-10 tracking-tight">
            Our Process
          </h2>

          <div className="relative lg:pl-8">
            {/* Background vertical tracker bar (Desktop Only) */}
            <div className="absolute left-0 top-0 w-[3px] h-full bg-[#1e3d4c]/50 rounded-full hidden lg:block"></div>
            {/* Active vertical progress fill (Desktop Only) */}
            <div
              ref={fillRef}
              className="absolute left-0 top-0 w-[3px] h-full bg-spenceSecondary rounded-full shadow-[0_0_10px_rgba(254,85,50,0.5)] hidden lg:block"
            ></div>

            <ul ref={listRef} className="space-y-10 lg:space-y-10 list-none p-0 m-0">
              {steps.map((step, index) => (
                <li key={index} className="group select-none">
                  <div className="flex items-start gap-5">
                    <span className="step-num inline-block font-serif text-2xl font-bold text-spenceSecondary lg:text-slate-600">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="step-title inline-block font-serif text-2xl md:text-3xl font-bold leading-tight text-white lg:text-slate-500">
                        {step.title}
                      </h3>
                      <p className="step-desc text-slate-300 text-sm md:text-base leading-relaxed overflow-hidden max-w-md mt-2 lg:mt-0">
                        {step.description}
                      </p>
                      {/* Mobile-only Step Image */}
                      <div className="mt-4 rounded-xl overflow-hidden border border-[#1e3d4c] lg:hidden block max-w-sm">
                        <img src={step.image} alt={step.title} className="w-full h-48 object-cover" />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
