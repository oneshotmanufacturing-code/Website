import React from "react";

const SectionTag = ({ children, center }: { children: React.ReactNode; center?: boolean }) => (
  <span
    className={`inline-block text-[18px] font-bold uppercase tracking-[0.15em] text-red mb-4 ${center ? "mx-auto" : ""
      }`}
  >
    {children}
  </span>
);

const SectionHeading = ({ children, center }: { children: React.ReactNode; center?: boolean }) => (
  <h2
    className={`font-display text-3xl sm:text-5xl md:text-7xl leading-none text-white-text ${center ? "text-center" : ""
      }`}
  >
    {children}
  </h2>
);

const addons = [
  "QC Report & Data",
  "Per-Unit Photos",
  "Cable Tagging",
  "Firmware Flashing",
  "Continuity Testing",
  "Partial Assembly",
  "Conformer Coating",
  "Potting",
];

export default function Addons() {
  return (
    <section id="addons" className="py-16 md:py-28 text-center min-h-screen flex items-center justify-center">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col items-center">
        <SectionTag center>EXTRAS</SectionTag>
        <SectionHeading center>OPTIONAL ADD-ONS</SectionHeading>

        <p className="font-body text-[16px] sm:text-[21px] text-grey mt-4">
          Available at additional cost. Mention when requesting a quote.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {addons.map((item, index) => (
            <span
              key={index}
              className="border border-dark-3 bg-white text-white-text font-body text-[15px] sm:text-[20px] px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg cursor-default hover:border-red/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
