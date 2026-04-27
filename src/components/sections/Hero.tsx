"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    tag: "WIRE & CABLE",
    headline: "BUILT TO\nPERFECTION.",
    sub: "Zero-defect harnesses, crimping & assembly — delivered on time, every time.",
    img: "/images/hero-1.png",
  },
  {
    tag: "PCB ASSEMBLY",
    headline: "BOARDS\nDONE RIGHT.",
    sub: "SMT, THT & mixed-tech — from prototype to production, flawlessly.",
    img: "/images/hero-2.png",
  },
  {
    tag: "FOR STARTUPS",
    headline: "NO MOQ.\nFREE PICKUP & DELIVERY.",
    sub: "End-To-End Service.",
    img: "/images/for-startup-3.jpg",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="hero" className="relative w-full overflow-hidden h-screen">
      {/* Background Images with Crossfade — full cover */}
      {slides.map((slide, index) => (
        <div
          key={slide.img}
          className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${index === currentSlide ? "opacity-100 z-0" : "opacity-0 z-[-1]"
            }`}
        >
          <Image
            src={slide.img}
            alt={slide.tag}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Gradient Overlay — left-heavy for text readability */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.50) 45%, rgba(0,0,0,0.15) 100%)',
        }}
      />
      {/* Bottom fade for dots/progress */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 z-[1]"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.50) 0%, transparent 100%)',
        }}
      />

      {/* Content — left-aligned */}
      <div className="absolute inset-0 z-10 flex items-center w-full px-5 sm:px-8 md:px-16">
        <div className="max-w-3xl">
          <span className="inline-block bg-red px-3 sm:px-5 py-1.5 sm:py-2 mb-4 sm:mb-6 text-[14px] sm:text-[18px] uppercase tracking-[0.15em] text-white font-semibold rounded-[2px]">
            {slides[currentSlide].tag}
          </span>

          <h1 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-[110px] leading-[0.95] text-white whitespace-pre-line">
            {slides[currentSlide].headline}
          </h1>

          <p className="font-body text-[20px] md:text-[24px] text-white/75 mt-5 max-w-lg leading-relaxed">
            {slides[currentSlide].sub}
          </p>

          <a
            href="#services"
            className="inline-flex items-center justify-center border-2 border-white/40 hover:border-white hover:bg-white/10 text-white font-display tracking-wide text-lg sm:text-2xl px-6 sm:px-10 h-12 sm:h-14 rounded-[2px] transition-all mt-6 sm:mt-8"
          >
            EXPLORE SERVICES
          </a>
        </div>
      </div>

      {/* Navigation and Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="text-white/50 hover:text-white transition-colors p-1"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentSlide ? "bg-red" : "bg-white/30"
                }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="text-white/50 hover:text-white transition-colors p-1"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Bottom Progress Bar */}
      <div
        key={currentSlide}
        className="absolute bottom-0 left-0 h-[3px] bg-red z-10"
        style={{ animation: "heroProgressBar 5s linear forwards" }}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes heroProgressBar {
            from { width: 0%; }
            to { width: 100%; }
          }
        `
      }} />
    </section>
  );
}
