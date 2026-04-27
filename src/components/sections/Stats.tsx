import React from "react";

const stats = [
  { number: '8+', label: 'YEARS IN OPERATION' },
  { number: '1000+', label: 'PROJECT EXPERIENCE' },
  { number: '99%', label: 'ON-TIME DELIVERY' },
  { number: '50+', label: 'ACTIVE CLIENTS' },
];

export default function Stats() {
  return (
    <section className="bg-dark-2 py-14">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-y-0">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center px-8 border-dark-3 ${index % 2 === 0 ? "border-r" : ""
                } ${index !== stats.length - 1 ? "md:border-r" : "md:border-r-0"
                }`}
            >
              <div className="font-display text-[84px] leading-none text-white-text">
                {stat.number}
              </div>
              <div className="font-body text-[16px] uppercase tracking-[0.12em] text-grey mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
