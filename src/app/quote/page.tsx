import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/layout/ScrollReveal";
import QuoteBuilder from "@/components/QuoteBuilder";

export const metadata: Metadata = {
  title: "Get a Quote — OneShot Manufacturing",
  description:
    "Request a quote for wire & cable prep, PCB assembly, or CNC manufacturing. Fill in the details or upload a spec sheet — we respond within 24 hours.",
  alternates: { canonical: "https://oneshotmanufacturing.com/quote" },
};

export default function QuotePage() {
  return (
    <>
      <ScrollReveal />
      <main className="relative min-h-screen bg-white">
        <Navbar solid />
        <section className="site-container section-pad" style={{ paddingTop: "140px", maxWidth: "800px" }}>
          <span className="eyebrow">Get a Quote</span>
          <h1 className="section-heading mb-3">Build Your Quote Request</h1>
          <p className="text-[#555555] text-base mb-10">
            Select your services, specify the details or upload a sheet, and we&apos;ll get back with a quotation within 24 hours.
          </p>
          <QuoteBuilder />
        </section>
        <Footer />
      </main>
    </>
  );
}
