import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/layout/ScrollReveal';

import Hero from '@/components/sections/Hero';
// import Stats from '@/components/sections/Stats';
import Services from '@/components/sections/Services';
import WhyUs from '@/components/sections/WhyUs';
import PcbQuality from '@/components/sections/PcbQuality';
import Addons from '@/components/sections/Addons';
import Process from '@/components/sections/Process';
import Contact from '@/components/sections/Contact';

export const metadata: Metadata = {
  title: "OneShot Manufacturing — Precision Wiring & PCB Assembly",
  description: "Contract electronics manufacturing in India. Wire harness assembly, PCB assembly, SMT, THT. Startup-friendly MOQ. Free pickup & delivery.",
};

export default function Home() {
  return (
    <>
      <ScrollReveal />

      {/* ── Fixed static wire-pattern background ── */}
      <div
        className="fixed inset-0 z-0 bg-[#FAFAFA]"
        style={{
          backgroundImage: 'url(/images/wire-pattern.svg)',
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
        }}
      />

      <main className="relative z-10 min-h-screen">
        <Navbar />
        <Hero />
        {/* <Stats /> */}
        <Services />
        <WhyUs />
        <PcbQuality />
        <Addons />
        <Process />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
