import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body",
});

const BASE_URL = "https://oneshotmanufacturing.com"; // update when domain is live

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "OneShot Manufacturing — Precision Wiring & Assembly Solutions",
    template: "%s | OneShot Manufacturing",
  },
  description:
    "Wire/cable preparation, PCB assembly, and electronics manufacturing services in Ahilyanagar, India. Free door-step pickup & delivery for batch orders. Pan-India shipping.",
  keywords: [
    "wire harness manufacturer India",
    "cable assembly Ahilyanagar",
    "PCB assembly outsourcing India",
    "electronics manufacturing services",
    "wire harness",
    "cable preparation",
    "PCB assembly",
    "electronics manufacturing",
    "Ahilyanagar",
    "MIDC",
    "Maharashtra",
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
      "Wire/cable preparation, PCB assembly, and electronics manufacturing in Ahilyanagar, India. Free door-step pickup & delivery for batch orders.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OneShot Manufacturing — Precision Wiring & Assembly Solutions",
    description:
      "Wire/cable preparation, PCB assembly, and electronics manufacturing in Ahilyanagar, India.",
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
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
