// Mayur Precision — Constants & Company Info

export const COMPANY = {
  name: "Mayur Precision",
  officialName: "Mayur Precision Products",
  shortName: "Mayur Precision",
  tagline: "Precision Wiring & Assembly Solutions",
  description:
    "Specializing in wire/cable preparation, PCB assembly, and custom electronic manufacturing services for businesses of all sizes.",
  established: 2018,
  gstin: "27AAIFM2903L1Z5",
  address: "L140, MIDC, Ahilyanagar, Maharashtra, India - 414111",
  mapsUrl: "https://maps.app.goo.gl/1WyyRTztDgSzYjEw8",
  phone: "+91 98765 43210",
  email: "info@mayurprecision.in",
  inquiryEmail: "info@mayurprecision.in",
  businessHours: {
    days: "Monday – Saturday",
    time: "9:00 AM – 6:00 PM IST",
    closed: "Sunday",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  services: [
    { label: "Wire & Cable Prep", href: "/services#wire-cable" },
    { label: "PCB Assembly", href: "/services#pcb-assembly" },
    { label: "Raw Material Sourcing", href: "/services#material" },
    { label: "Door-Step Pickup & Delivery", href: "/services#quote-builder" },
    { label: "Get a Quote", href: "/services#quote-builder" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Why Outsource", href: "/about#why-outsource" },
    { label: "Quality Standards", href: "/about#quality" },
    { label: "Contact Us", href: "/contact" },
  ],
} as const;

export const DIFFERENTIATORS = [
  {
    title: "Precision Quality",
    description:
      "Every wire, every solder joint — inspected and tested before it leaves our facility.",
    icon: "Shield",
  },
  {
    title: "On-Time Delivery",
    description:
      "We understand production timelines. Our promise: no missed deadlines.",
    icon: "Clock",
  },
  {
    title: "Flexible Sourcing",
    description:
      "Buyer-supplied, we-procure, or hybrid — choose the model that fits your budget.",
    icon: "Package",
  },
  {
    title: "Competitive Pricing",
    description:
      "Transparent, volume-based pricing with no hidden charges.",
    icon: "IndianRupee",
  },
  {
    title: "Free Door-Step Pickup & Delivery",
    description:
      "For batch manufacturing orders, we offer complimentary pickup from your facility and delivery back to your door — anywhere in India.",
    icon: "Truck",
  },
] as const;

export const PROCESS_STEPS = [
  {
    step: 1,
    title: "Inquiry",
    description: "Share your requirements via our quote builder or email.",
    icon: "MessageSquare",
  },
  {
    step: 2,
    title: "Design Review",
    description: "Our engineers review specs, suggest optimizations, and confirm scope.",
    icon: "FileSearch",
  },
  {
    step: 3,
    title: "Production",
    description: "Precision manufacturing with in-process quality checks at every stage.",
    icon: "Factory",
  },
  {
    step: 4,
    title: "Delivery",
    description: "Packaged, labeled, and delivered on schedule to your door.",
    icon: "Truck",
  },
] as const;
