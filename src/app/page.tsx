import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/layout/ScrollReveal';

import Hero from '@/components/sections/Hero';
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


      <main className="relative min-h-screen bg-white">
        <Navbar />
        <Hero />
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
