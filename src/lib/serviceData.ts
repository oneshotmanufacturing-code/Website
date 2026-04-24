// OneShot Manufacturing — Complete Service Catalog Data

export interface ServiceCategory {
  id: string;
  title: string;
  items: string[];
}

export interface ServiceGroup {
  id: string;
  title: string;
  description: string;
  icon: string;
  categories: ServiceCategory[];
}

export const WIRE_CABLE_SERVICES: ServiceGroup = {
  id: "wire-cable",
  title: "Wire & Cable Services",
  description:
    "End-to-end wire and cable preparation — from raw spools to finished, labeled, and tested assemblies ready for integration.",
  icon: "Cable",
  categories: [
    {
      id: "cable-types",
      title: "Cable Types",
      items: [
        "Single-core",
        "Multi-core",
        "Ribbon",
        "Coaxial",
        "Shielded",
        "Flat Flex (FFC/FPC)",
        "Silicone",
        "Teflon (PTFE)",
      ],
    },
    {
      id: "connectors",
      title: "Connectors",
      items: [
        "JST (XH, PH, VH, SM)",
        "Molex (Micro-Fit, Mini-Fit)",
        "TE Connectivity",
        "Deutsch",
        "D-Sub (9/15/25 pin)",
        "RJ45 / RJ11",
        "USB (A, B, C, Micro)",
        "Barrel Jack (DC)",
        "KF / Screw Terminal",
      ],
    },
    {
      id: "crimping",
      title: "Crimping",
      items: [
        "Open barrel",
        "Closed barrel",
        "Insulated",
        "Flag terminal",
        "Ring terminal",
        "Spade terminal",
        "Fork terminal",
        "Bootlace ferrule",
      ],
    },
    {
      id: "processing",
      title: "Processing",
      items: [
        "Cut-to-length",
        "Stripping",
        "Tinning",
        "Soldering",
        "Labeling",
        "Heat-shrink tubing",
        "Sleeving / Braiding",
        "Potting / Encapsulation",
      ],
    },
    {
      id: "assemblies",
      title: "Assemblies",
      items: [
        "Wire harnesses",
        "Cable looms",
        "Custom cables",
        "Panel wiring",
        "Junction box wiring",
      ],
    },
  ],
};

export const PCB_ASSEMBLY_SERVICES: ServiceGroup = {
  id: "pcb-assembly",
  title: "PCB Assembly",
  description:
    "From single-board prototypes to mid-volume production runs — complete PCB assembly with sourcing, placement, soldering, and testing.",
  icon: "Cpu",
  categories: [
    {
      id: "assembly-types",
      title: "Assembly Types",
      items: [
        "THT (Through-Hole Technology)",
        "SMT (Surface Mount Technology)",
        "Mixed-technology (THT + SMT)",
      ],
    },
    {
      id: "services",
      title: "Services",
      items: [
        "Component sourcing",
        "Solder paste stencil creation",
        "Pick-and-place",
        "Reflow soldering",
        "Wave soldering",
        "Hand soldering",
        "Conformal coating",
      ],
    },
    {
      id: "testing",
      title: "Testing & QC",
      items: [
        "Visual inspection",
        "Magnified inspection (10x–30x)",
        "Functional testing",
        "In-circuit testing (ICT)",
      ],
    },
    {
      id: "volume",
      title: "Volume Capability",
      items: [
        "Prototype (1–50 units)",
        "Small-batch (50–500 units)",
        "Mid-volume (500–5,000 units)",
      ],
    },
  ],
};

export const CNC_SERVICES: ServiceGroup = {
  id: "cnc-manufacturing",
  title: "CNC Manufacturing",
  description:
    "High-precision CNC milled parts, gear manufacturing, and turned components in various materials. Upload your drawings for an accurate quotation.",
  icon: "Settings",
  categories: [
    {
      id: "cnc-types",
      title: "Manufacturing Types",
      items: [
        "CNC Milling (3, 4, 5-Axis)",
        "CNC Turning / Lathe",
        "Gear Manufacturing",
        "Precision Machining",
        "Sheet Metal Fabrication",
      ],
    },
    {
      id: "cnc-materials",
      title: "Materials",
      items: [
        "Aluminum (6061, 7075)",
        "Stainless Steel (304, 316)",
        "Mild Steel / Carbon Steel",
        "Brass & Copper",
        "Plastics (Delrin, Nylon, PEEK)",
      ],
    },
    {
      id: "cnc-finishes",
      title: "Surface Finishes",
      items: [
        "As Machined",
        "Anodizing (Clear, Hard, Color)",
        "Powder Coating",
        "Bead Blasting",
        "Plating (Zinc, Nickel)",
      ],
    },
  ],
};

export const RAW_MATERIAL_OPTIONS = {
  id: "material",
  title: "Raw Material Sourcing",
  description:
    "Choose the procurement model that fits your budget and timeline.",
  options: [
    {
      id: "buyer",
      label: "Buyer-Supplied",
      description: "You provide all components and raw materials. We assemble.",
    },
    {
      id: "we_procure",
      label: "We Procure",
      description:
        "Share your BOM — we'll source everything from our trusted supplier network.",
    },
    {
      id: "hybrid",
      label: "Hybrid",
      description:
        "You supply critical / long-lead components, we source the rest.",
    },
  ],
} as const;

// ── Quote Builder Dropdown Options ──

export const CABLE_TYPE_OPTIONS = WIRE_CABLE_SERVICES.categories
  .find((c) => c.id === "cable-types")!
  .items;

export const CONNECTOR_OPTIONS = WIRE_CABLE_SERVICES.categories
  .find((c) => c.id === "connectors")!
  .items;

export const CRIMPING_OPTIONS = WIRE_CABLE_SERVICES.categories
  .find((c) => c.id === "crimping")!
  .items;

export const PROCESSING_OPTIONS = WIRE_CABLE_SERVICES.categories
  .find((c) => c.id === "processing")!
  .items;

export const PCB_TYPE_OPTIONS = PCB_ASSEMBLY_SERVICES.categories
  .find((c) => c.id === "assembly-types")!
  .items;

export const CNC_TYPE_OPTIONS = CNC_SERVICES.categories
  .find((c) => c.id === "cnc-types")!
  .items;

export const CNC_MATERIAL_OPTIONS = CNC_SERVICES.categories
  .find((c) => c.id === "cnc-materials")!
  .items;

export const ALL_SERVICE_GROUPS: ServiceGroup[] = [
  WIRE_CABLE_SERVICES,
  PCB_ASSEMBLY_SERVICES,
  CNC_SERVICES,
];
