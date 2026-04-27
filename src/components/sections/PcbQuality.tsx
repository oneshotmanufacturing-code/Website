import React from "react";

const SectionTag = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block text-[18px] font-bold uppercase tracking-[0.15em] text-red mb-4">
    {children}
  </span>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-3xl sm:text-5xl md:text-7xl leading-none text-white-text">
    {children}
  </h2>
);

const pcbPoints = [
  {
    title: "Short Turnaround",
    desc: "Fast cycles for rapid hardware iteration",
  },
  {
    title: "Lead-Free Solder",
    desc: "RoHS-compliant, safe for your team",
  },
  {
    title: "Digitally Controlled Reflow",
    desc: "Oven settings managed by software, not guesswork",
  },
  {
    title: "Computer Vision Inspection",
    desc: "Every board verified under microscope + CV",
  },
  {
    title: "ESD-Safe Environment",
    desc: "Grounded, gloved, ISO-handled throughout",
  },
  {
    title: "ESD Packaging",
    desc: "Anti-static packaging, boards arrive intact",
  },
];

export default function PCBQuality() {
  return (
    <section id="pcb" className="py-16 md:py-28 min-h-screen flex items-center">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <header className="flex flex-col items-start">
          <SectionTag>PCB PROCESS</SectionTag>
          <SectionHeading>PCB ASSEMBLY QUALITY</SectionHeading>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
          {pcbPoints.map((point, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-white border border-dark-3 border-t-2 border-t-red p-6 rounded-lg hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-red/30 transition-all duration-300"
            >
              {/* Glow line at top */}
              <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-red to-transparent transition-all duration-700 group-hover:w-full" />

              <h3 className="font-body font-semibold text-[18px] sm:text-[24px] text-white-text">
                {point.title}
              </h3>
              <p className="font-body text-[16px] sm:text-[21px] text-grey mt-2 leading-relaxed">
                {point.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
