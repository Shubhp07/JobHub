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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSectionRef.current,
          start: "top top",
          end: `+=${listItems.length * 100}%`,
          pin: true,
          scrub: true,
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
          gsap.set(slides[i], { autoAlpha: 0 });
        } else {
          gsap.set(titleElement, { color: "#FE5532", scale: 1.1, y: 0 });
          gsap.set(numElement, { color: "#FE5532", scale: 1.1 });
          gsap.set(descElement, { height: "auto", opacity: 1, marginTop: 8 });
          gsap.set(slides[i], { autoAlpha: 1 });
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

        tl.to(titleElement, { color: "#FE5532", scale: 1.1, y: 0, ease: "back.out(2)", duration: 0.35 }, 0.5 * i)
          .to(numElement, { color: "#FE5532", scale: 1.1, ease: "back.out(2)", duration: 0.35 }, "<")
          .to(descElement, { height: "auto", opacity: 1, marginTop: 8, duration: 0.35 }, "<")
          .to(slides[i], { autoAlpha: 1, duration: 0.35 }, "<")

          .to(prevTitle, { color: "#475569", scale: 0.85, y: 10, ease: "power2.inOut", duration: 0.35 }, "<")
          .to(prevNum, { color: "#334155", scale: 0.85, ease: "power2.inOut", duration: 0.35 }, "<")
          .to(prevDesc, { height: 0, opacity: 0, marginTop: 0, duration: 0.35 }, "<")
          .to(slides[i - 1], { autoAlpha: 0, duration: 0.35 }, "<");
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
    }, pinSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={pinSectionRef}
      className="pin-section w-full h-screen bg-spencePrimary border-t border-b border-[#1e3d4c] flex items-center justify-center overflow-hidden relative"
    >
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-spenceSecondary/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-spenceSecondary/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="content w-full max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-20 items-center relative">
        {/* Left Side: Steps List (Col span 4) */}
        <div className="md:col-span-4 lg:col-span-4">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-10 tracking-tight">
            Our Process
          </h2>

          <div className="relative pl-8">
            {/* Background vertical tracker bar */}
            <div className="absolute left-0 top-0 w-[3px] h-full bg-[#1e3d4c] rounded-full"></div>
            {/* Active vertical progress fill */}
            <div
              ref={fillRef}
              className="absolute left-0 top-0 w-[3px] h-full bg-spenceSecondary rounded-full shadow-[0_0_10px_rgba(254,85,50,0.5)]"
            ></div>

            <ul ref={listRef} className="space-y-10 list-none p-0 m-0">
              {steps.map((step, index) => (
                <li key={index} className="group select-none">
                  <div className="flex items-start gap-5">
                    <span className="step-num inline-block font-serif text-2xl font-bold">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="step-title inline-block font-serif text-2xl md:text-3xl font-bold leading-tight">
                        {step.title}
                      </h3>
                      <p className="step-desc text-slate-400 text-sm md:text-base leading-relaxed overflow-hidden max-w-md">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side: Slides (Col span 8) */}
        <div className="md:col-span-8 lg:col-span-8 relative w-full h-[400px] md:h-[550px] flex items-center justify-center">
          {steps.map((step, index) => (
            <div
              key={index}
              className="slide absolute inset-0 flex items-center justify-center opacity-0 invisible"
            >
              <div className="relative p-2 bg-[#132b36]/80 backdrop-blur-md border border-[#1e3d4c] rounded-3xl shadow-3xl shadow-black/50 w-full max-w-[800px]">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full aspect-[16/10] object-cover rounded-[20px] border border-[#1e3d4c]/50 shadow-inner"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
