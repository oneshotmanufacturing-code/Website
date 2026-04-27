import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-dark-3">
      {/* Upper section */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          
          {/* Col 1 */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="font-display text-[24px] sm:text-[33px] text-white-text">
              ONESHOT
            </div>
            <div className="font-body text-[16px] sm:text-[20px] text-grey mt-2">
              Precision Wiring & Assembly Solutions
            </div>
            <div className="font-body text-[14px] sm:text-[16px] text-dim mt-4">
              GSTIN: 27AAIFM2903L1Z5
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="font-body text-[14px] sm:text-[16px] uppercase tracking-wide text-grey mb-4">
              Quick Links
            </h3>
            <a href="#services" className="font-body text-[16px] sm:text-[21px] text-grey hover:text-red block mb-2 transition-colors">
              Services
            </a>
            <a href="#why-us" className="font-body text-[16px] sm:text-[21px] text-grey hover:text-red block mb-2 transition-colors">
              Why Us
            </a>
            <a href="#process" className="font-body text-[16px] sm:text-[21px] text-grey hover:text-red block mb-2 transition-colors">
              Process
            </a>
            <a href="#contact" className="font-body text-[16px] sm:text-[21px] text-grey hover:text-red block mb-2 transition-colors">
              Contact
            </a>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="font-body text-[14px] sm:text-[16px] uppercase tracking-wide text-grey mb-4">
              Company
            </h3>
            <a href="#" className="font-body text-[16px] sm:text-[21px] text-grey hover:text-red block mb-2 transition-colors">
              Quality Standards
            </a>
            <a href="#" className="font-body text-[16px] sm:text-[21px] text-grey hover:text-red block mb-2 transition-colors">
              ESD Policy
            </a>
            <a href="#" className="font-body text-[16px] sm:text-[21px] text-grey hover:text-red block mb-2 transition-colors">
              About
            </a>
          </div>

          {/* Col 4 */}
          <div>
            <h3 className="font-body text-[14px] sm:text-[16px] uppercase tracking-wide text-grey mb-4">
              Contact
            </h3>
            <span className="font-body text-[16px] sm:text-[20px] text-grey block mb-2">
              +91 95884 46409
            </span>
            <span className="font-body text-[16px] sm:text-[20px] text-grey block mb-2 break-all">
              info@oneshotmanufacturing.com
            </span>
            <span className="font-body text-[16px] sm:text-[20px] text-grey block mb-2">
              Mon–Sat, 9AM–6PM IST
            </span>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-dark-3 py-6">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="font-body text-[14px] sm:text-[18px] text-dim text-center sm:text-left">
            © 2026 OneShot Manufacturing. All rights reserved.
          </div>
          <div className="font-body text-[14px] sm:text-[18px] text-dim text-center sm:text-right">
            L140, MIDC, Ahilyanagar, Maharashtra — 414111
          </div>
        </div>
      </div>
    </footer>
  );
}
