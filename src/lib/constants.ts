// OneShot Manufacturing — Constants & Company Info

export const COMPANY = {
  name: "OneShot Manufacturing",
  officialName: "OneShot Manufacturing",
  shortName: "OneShot Manufacturing",
  tagline: "Precision Wiring & Assembly Solutions",
  description:
    "Specializing in wire/cable preparation, PCB assembly, and custom electronic manufacturing services for businesses of all sizes.",
  established: 2018,
  gstin: "29AAKFO2720R1ZM",
  address: "AVS Layout, Ejipura, Koramangala 4th Block, Bengaluru, Karnataka - 560095",
  addressLines: [
    "AVS Layout, Ejipura",
    "Koramangala 4th Block",
    "Bengaluru, Karnataka - 560095",
  ],
  mapsUrl: "https://maps.app.goo.gl/1WyyRTztDgSzYjEw8",
  phone: "+91 96064 77077",
  email: "contact@oneshotmanufacturing.com",
  inquiryEmail: "contact@oneshotmanufacturing.com",
  website: "www.oneshotmanufacturing.com",
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
    { label: "Door-Step Pickup & Delivery", href: "/services#logistics" },
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
