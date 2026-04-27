# FILE 2 — COMPONENT LIBRARY
## OneShot Manufacturing — What to Build & Where

---

## FOLDER STRUCTURE

```
src/
├── app/
│   ├── layout.tsx          ← fonts, metadata, FloatingCTA
│   ├── page.tsx            ← imports all sections in order
│   └── admin/
│       └── page.tsx        ← existing admin, no change
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   ├── ui/                 ← small reusable primitives
│   │   ├── SectionTag.tsx
│   │   ├── SectionHeading.tsx
│   │   ├── RedButton.tsx
│   │   └── GhostButton.tsx
│   │
│   └── sections/           ← one file per page section
│       ├── Hero.tsx
│       ├── Stats.tsx
│       ├── Services.tsx
│       ├── WhyUs.tsx
│       ├── PcbQuality.tsx
│       ├── Addons.tsx
│       ├── Process.tsx
│       └── Contact.tsx
│
└── lib/
    └── supabase.ts         ← existing, no change
```

---

## UI PRIMITIVES

---

### `SectionTag.tsx`
Small uppercase red label that sits above every section heading.

```tsx
// Usage: <SectionTag>OUR SERVICES</SectionTag>

// Renders:
// [  ——  OUR SERVICES  ]  ← red text, small, centered or left

Props: { children: string, center?: boolean }
Style: text-[11px] tracking-[0.15em] uppercase text-[--red] font-medium
       optional: flex items-center gap-2 with short red lines either side
```

---

### `SectionHeading.tsx`
Bebas Neue heading with optional subtitle.

```tsx
// Usage: <SectionHeading sub="short description">WHAT WE BUILD</SectionHeading>

Props: { children: string, sub?: string, center?: boolean }
Heading style: Bebas Neue, clamp(40px, 5vw, 72px), --white
Sub style: DM Sans 15px, --grey, mt-3, max-w-lg
```

---

### `RedButton.tsx`
Primary CTA button.

```tsx
Props: { children, href?, onClick?, size?: 'sm' | 'md' | 'lg' }

Style:
  bg-[--red] hover:bg-[--red-hover]
  text-white font-['Bebas_Neue'] tracking-wide
  px-8 h-12 rounded-[2px]
  transition-all duration-150
  hover:scale-[1.02]
```

---

### `GhostButton.tsx`
Secondary CTA button — outline only.

```tsx
Props: { children, href?, onClick? }

Style:
  border border-white/40 hover:border-white
  text-white font-['Bebas_Neue'] tracking-wide
  px-8 h-12 rounded-[2px]
  transition-all duration-150
```

---

## SECTION COMPONENTS

---

### `Navbar.tsx`

**State:** `isScrolled` (boolean) — changes background on scroll
**Links:** anchor tags only (#services, #why-us, #pcb, #process, #contact)

```
Renders:
  <nav fixed top-0 z-50>
    [transparent] → [bg-[--dark-1] shadow] on scroll

    <Logo />   ←→   <NavLinks />   <RedButton href="#contact">Get a Quote</RedButton>
    
    Mobile: <HamburgerIcon /> → <MobileMenu />
  </nav>
```

No login link. No external page links.

---

### `Hero.tsx`

**State:** `currentSlide` (0|1|2), auto-advance with `setInterval` 5000ms
**Images:** `/public/images/hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg`

```
Renders:
  <section id="hero" h-screen relative overflow-hidden>
    <BackgroundImage key={slide} crossfade />
    <DarkOverlay opacity-55 />
    
    <Content left-aligned, centered vertical>
      <SectionTag>{slide.tag}</SectionTag>
      <h1 Bebas Neue>{slide.headline}</h1>
      <p DM Sans>{slide.subline}</p>
      <div flex gap-4>
        <GhostButton href="#services">View Services →</GhostButton>
        <RedButton href="#contact">Get a Quote</RedButton>
      </div>
    </Content>

    <ProgressBar />   ← bottom, animates per slide
    <DotIndicators /> ← bottom center
  </section>
```

---

### `Stats.tsx`

**No state.** Static data array.

```
Renders:
  <section bg-[--dark-2]>
    <div grid grid-cols-4 divide-x divide-[--dark-3]>
      {stats.map → <StatBlock number="8+" label="YEARS" />}
    </div>
  </section>

StatBlock:
  <div text-center py-10>
    <span Bebas Neue 56px>{number}</span>
    <span DM Sans 11px uppercase grey>{label}</span>
  </div>
```

---

### `Services.tsx`

**No state.** 3 service objects in array.

```
Renders:
  <section id="services" bg-[--black]>
    <SectionTag>OUR SERVICES</SectionTag>
    <SectionHeading>WHAT WE BUILD</SectionHeading>

    <div grid grid-cols-3 gap-5>
      {services.map → <ServiceCard />}
    </div>
  </section>

ServiceCard:
  <div bg-[--dark-2] border-t-2 border-[--red] rounded-[2px]>
    <img h-[220px] object-cover />
    <div p-6>
      <h3 DM Sans 600>{title}</h3>
      <p DM Sans 14px grey>{desc}</p>
      <span text-[--red] 13px>→ Learn more</span>
    </div>
  </div>
```

---

### `WhyUs.tsx`

**No state.**

```
Renders:
  <section id="why-us" bg-[--dark-1]>
    <div grid grid-cols-[2fr_3fr] gap-0>
      <img src="factory.jpg" object-cover full-height />
      
      <div p-16>
        <SectionTag>OUR EDGE</SectionTag>
        <SectionHeading>WHY ONESHOT</SectionHeading>
        
        <div flex flex-col gap-6 mt-10>
          {values.map → <ValueRow />}
        </div>
      </div>
    </div>
  </section>

ValueRow:
  <div flex items-start gap-4>
    <span w-2 h-2 rounded-full bg-[--red] mt-2 flex-shrink-0 />
    <div>
      <p DM Sans 600 16px white>{title}</p>
      <p DM Sans 14px grey>{desc}</p>
    </div>
  </div>
```

---

### `PcbQuality.tsx`

**No state.**

```
Renders:
  <section id="pcb" bg-[--black]>
    <SectionTag>PCB PROCESS</SectionTag>
    <SectionHeading>PCB ASSEMBLY QUALITY</SectionHeading>

    <div grid grid-cols-3 gap-5>
      {pcbPoints.map → <QualityCard />}
    </div>
  </section>

QualityCard:
  <div bg-[--dark-2] border border-[--dark-3] border-t-2 border-t-[--red] p-6>
    <h3 DM Sans 600 16px white>{title}</h3>
    <p DM Sans 14px grey mt-2>{desc}</p>
  </div>
```

---

### `Addons.tsx`

**No state.**

```
Renders:
  <section id="addons" bg-[--dark-1] text-center>
    <SectionTag>EXTRAS</SectionTag>
    <SectionHeading>OPTIONAL ADD-ONS</SectionHeading>
    <p DM Sans 14px grey>Available at additional cost. Mention when requesting a quote.</p>

    <div flex flex-wrap justify-center gap-3 mt-10>
      {addons.map → <AddonBadge label={addon} />}
    </div>
  </section>

AddonBadge:
  <span border border-[--red-dim] text-white px-4 py-2 text-[13px] rounded-[2px]
        hover:bg-[--red-dim] transition-colors cursor-default>
    {label}
  </span>
```

---

### `Process.tsx`

**No state.**

```
Renders:
  <section id="process" bg-[--black]>
    <SectionTag>PROCESS</SectionTag>
    <SectionHeading>HOW IT WORKS</SectionHeading>

    <div relative grid grid-cols-4 gap-8>
      <RedDashedConnector />  ← absolute line behind steps, desktop only

      {steps.map → <ProcessStep />}
    </div>
  </section>

ProcessStep:
  <div flex flex-col>
    <span Bebas Neue 48px text-[--red]>{number}</span>
    <h3 DM Sans 600 16px white mt-2>{title}</h3>
    <p DM Sans 13px grey mt-1>{desc}</p>
  </div>
```

---

### `Contact.tsx`

**State:** form fields + errors + `isSubmitting` + `isSuccess`

```
Renders:
  <section id="contact" bg-[--dark-1]>
    <SectionTag>CONTACT</SectionTag>
    <SectionHeading>GET IN TOUCH</SectionHeading>

    <div grid grid-cols-2 gap-0>

      <InfoPanel bg-[--dark-2] p-12>
        <ContactDetail label="ADDRESS">{address}</ContactDetail>
        <ContactDetail label="PHONE">{phone}</ContactDetail>
        <ContactDetail label="EMAIL">{email}</ContactDetail>
        <ContactDetail label="HOURS">Mon–Sat, 9AM–6PM IST</ContactDetail>
      </InfoPanel>

      <FormPanel bg-[--dark-2] border-l border-[--dark-3] p-12>
        <FormField label="FULL NAME" required />
        <FormField label="EMAIL" type="email" required />
        <FormField label="PHONE" type="tel" required />
        <FormField label="COMPANY" />
        <FormField label="MESSAGE" type="textarea" required />
        <FileUpload label="ATTACHMENT (optional)" />
        <RedButton full-width type="submit">SEND MESSAGE →</RedButton>
      </FormPanel>

    </div>
  </section>

FormField style:
  label: DM Sans 11px uppercase grey tracking-wide mb-1
  input: w-full bg-[--dark-3] border border-[--dim] focus:border-[--red]
         text-white px-4 py-3 rounded-[2px] outline-none transition-colors

Error state: border-red-500 + small red error text below
Success state: replace form with "Thank you. We'll be in touch." centered
```

---

### `Footer.tsx`

**No state.**

```
Renders:
  <footer bg-[--black] border-t border-[--dark-3]>
    <div grid grid-cols-4 gap-8 py-16>
      <Col1: Logo + tagline + GSTIN />
      <Col2: Quick links (anchor) />
      <Col3: Info links />
      <Col4: Contact info />
    </div>
    <BottomBar>
      © 2026 OneShot Manufacturing  |  L140, MIDC, Ahilyanagar, Maharashtra
    </BottomBar>
  </footer>
```

---

## WHAT IS NOT A COMPONENT

These are just data arrays defined at the top of their section file:

```ts
// In Hero.tsx
const slides = [
  { tag: 'WIRE & CABLE', headline: 'PRECISION WIRING.\nZERO DEFECTS.', sub: 'Custom harnesses built to spec' },
  { tag: 'PCB ASSEMBLY', headline: 'SMT TO MIXED-TECH.\nSTART TO FINISH.', sub: 'Prototype to mid-volume, lead-free' },
  { tag: 'FOR STARTUPS', headline: 'LOW VOLUME.\nHIGH STANDARD.', sub: 'Free pickup & delivery across India' },
]

// In Services.tsx
const services = [
  { title: 'Wire & Cable Preparation', desc: 'Custom harnesses, crimping, harness assembly', img: '/images/wire.jpg' },
  { title: 'PCB Assembly', desc: 'SMT, THT, mixed-tech — prototype to mid-volume', img: '/images/pcb.jpg' },
  { title: 'Raw Material Sourcing', desc: 'Buyer-supplied, we-procure, or hybrid models', img: '/images/sourcing.jpg' },
]

// In WhyUs.tsx
const values = [
  { title: 'Computer Vision QC', desc: 'Every unit inspected by CV + human double-check' },
  { title: 'Cable Tracking & Tagging', desc: 'Labeled, tracked, photographed per unit' },
  { title: 'Free Pickup & Delivery', desc: 'Door-to-door logistics anywhere in India' },
  { title: 'ESD-Safe Handling', desc: 'ISO-compliant from bench to box' },
  { title: 'Fast Turnaround', desc: 'Short cycles built for hardware iteration' },
  { title: 'Startup-Friendly MOQ', desc: 'No minimum too small' },
]

// In PcbQuality.tsx
const pcbPoints = [
  { title: 'Short Turnaround', desc: 'Fast cycles for rapid hardware iteration' },
  { title: 'Lead-Free Solder', desc: 'RoHS-compliant, safe for your team' },
  { title: 'Digitally Controlled Reflow', desc: 'Oven settings managed by software, not guesswork' },
  { title: 'Computer Vision Inspection', desc: 'Every board verified under microscope + CV' },
  { title: 'ESD-Safe Environment', desc: 'Grounded, gloved, ISO-handled throughout' },
  { title: 'ESD Packaging', desc: 'Anti-static packaging, boards arrive intact' },
]

// In Addons.tsx
const addons = [
  'QC Report & Data', 'Per-Unit Photos', 'Cable Tagging', 'Cut-to-Length',
  'Firmware Flashing', 'Continuity Testing', 'Partial Assembly', 'Conformer Coating', 'Potting',
]

// In Process.tsx
const steps = [
  { number: '01', title: 'Inquiry', desc: 'Share requirements via form or email' },
  { number: '02', title: 'Design Review', desc: 'Engineers confirm specs and optimizations' },
  { number: '03', title: 'Production', desc: 'Precision manufacturing with in-process QC' },
  { number: '04', title: 'Delivery', desc: 'Packaged, labeled, shipped on time' },
]
```

---

## ADMIN ROUTE

```
/admin  → Keep existing admin panel entirely unchanged.
          This route is NOT linked from anywhere on the website.
          No login button, no "Admin" link — nothing.
          Access only via direct URL.
```
