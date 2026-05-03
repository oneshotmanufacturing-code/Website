import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-inter",
});

const BASE_URL = "https://oneshotmanufacturing.com"; // update when domain is live

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "OneShot Manufacturing — Precision Wiring & Assembly Solutions",
    template: "%s | OneShot Manufacturing",
  },
  description:
    "Wire/cable preparation, PCB assembly, and electronics manufacturing services in Bengaluru, India. Free door-step pickup & delivery for batch orders. Pan-India shipping.",
  keywords: [
    "wire harness manufacturer India",
    "cable assembly Bengaluru",
    "PCB assembly outsourcing India",
    "electronics manufacturing services",
    "wire harness",
    "cable preparation",
    "PCB assembly",
    "electronics manufacturing",
    "Bengaluru",
    "Koramangala",
    "Karnataka",
    "India",
    "OneShot Manufacturing",
    "OneShot Manufacturing",
    "contract manufacturing",
    "batch manufacturing",
  ],
  authors: [{ name: "OneShot Manufacturing" }],
  creator: "OneShot Manufacturing",
  publisher: "OneShot Manufacturing",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "OneShot Manufacturing",
    title: "OneShot Manufacturing — Precision Wiring & Assembly Solutions",
    description:
      "Wire/cable preparation, PCB assembly, and electronics manufacturing in Bengaluru, India. Free door-step pickup & delivery for batch orders.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OneShot Manufacturing — Precision Wiring & Assembly Solutions",
    description:
      "Wire/cable preparation, PCB assembly, and electronics manufacturing in Bengaluru, India.",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased" style={{ fontFamily: "var(--font-inter, 'Inter', 'Roboto', system-ui, sans-serif)" }}>
        {children}
      </body>
    </html>
  );
}
