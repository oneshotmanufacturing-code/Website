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

const steps = [
  {
    number: "01",
    title: "Inquiry",
    desc: "Share requirements via the quote form or email",
  },
  {
    number: "02",
    title: "Design Review",
    desc: "Engineers confirm specs and suggest optimizations",
  },
  {
    number: "03",
    title: "Production",
    desc: "Precision manufacturing with in-process QC",
  },
  {
    number: "04",
    title: "Delivery",
    desc: "Packaged, labeled, shipped on time",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-16 md:py-28 min-h-screen flex items-center">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <header className="flex flex-col items-start">
          <SectionTag>PROCESS</SectionTag>
          <SectionHeading>HOW IT WORKS</SectionHeading>
        </header>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 mt-14">
          {/* Desktop timeline connector */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed z-0" style={{ borderColor: 'rgba(192,57,43,0.4)' }} />

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 group">
              {/* Step card container */}
              <div className="bg-white border border-dark-3 rounded-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-red/30">
                {/* Glow line at top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] w-0 bg-gradient-to-r from-red to-transparent transition-all duration-700 group-hover:w-full rounded-t-lg" />

                <div className="font-display text-[48px] sm:text-[72px] text-red leading-none">
                  {step.number}
                </div>
                <h3 className="font-body font-semibold text-[18px] sm:text-[24px] text-white-text mt-3">
                  {step.title}
                </h3>
                <p className="font-body text-[16px] sm:text-[20px] text-grey mt-1 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
