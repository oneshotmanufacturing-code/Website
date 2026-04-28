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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        height: "100vh",
        /* Push content below announcement bar (40px) + navbar (64px) */
        marginTop: "104px",
        height: "calc(100vh - 104px)",
      }}
    >
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.img}
          style={{
            position: "absolute",
            inset: 0,
            opacity: index === currentSlide ? 1 : 0,
            zIndex: index === currentSlide ? 0 : -1,
            transition: "opacity 1.2s ease-in-out",
          }}
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

      {/* Navy-tinted dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "rgba(10, 25, 60, 0.65)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
        }}
      >
        <div style={{ maxWidth: "700px" }}>
          {/* Amber badge tag */}
          <span
            style={{
              display: "inline-block",
              background: "#F7941D",
              color: "#FFFFFF",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.10em",
              padding: "4px 10px",
              marginBottom: "20px",
            }}
          >
            {slides[currentSlide].tag}
          </span>

          {/* Headline */}
          <h1
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 900,
              lineHeight: 1.0,
              textTransform: "uppercase",
              whiteSpace: "pre-line",
              marginBottom: "20px",
            }}
          >
            {slides[currentSlide].headline}
          </h1>

          {/* Subtext */}
          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: 1.6,
              maxWidth: "480px",
              marginBottom: "32px",
            }}
          >
            {slides[currentSlide].sub}
          </p>

          {/* CTA */}
          <a
            href="#services"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "14px 32px",
              borderRadius: "4px",
              border: "2px solid rgba(255,255,255,0.80)",
              textDecoration: "none",
              transition: "background 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "#F7941D";
              el.style.borderColor = "#F7941D";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "transparent";
              el.style.borderColor = "rgba(255,255,255,0.80)";
            }}
          >
            EXPLORE SERVICES
          </a>
        </div>
      </div>

      {/* Slide navigation + amber dot indicators */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.60)",
            cursor: "pointer",
            padding: "4px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.60)"; }}
        >
          <ChevronLeft size={22} />
        </button>

        <div style={{ display: "flex", gap: "8px" }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: index === currentSlide ? "#F7941D" : "rgba(255,255,255,0.35)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.60)",
            cursor: "pointer",
            padding: "4px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.60)"; }}
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Bottom progress bar */}
      <div
        key={currentSlide}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "3px",
          background: "#F7941D",
          zIndex: 10,
          animation: "heroProgressBar 5s linear forwards",
        }}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes heroProgressBar {
            from { width: 0%; }
            to   { width: 100%; }
          }
        `
      }} />
    </section>
  );
}
