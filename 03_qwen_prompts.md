# FILE 3 — QWEN 2.5 CODER PROMPTS
## OneShot Manufacturing — Run These in Order

**How to use:** Open your terminal, run `ollama run qwen2.5-coder:32b`,
then paste each prompt below one at a time. Wait for full output before next prompt.
Run all file edits inside your project root: `~/projects/oneshotmanufacturing/`

---

## BEFORE YOU START — Checklist

```bash
# In your project root, confirm these exist:
ls src/app/page.tsx
ls tailwind.config.ts
ls src/app/globals.css

# Install the two fonts (already in package.json if using next/font):
# Bebas Neue + DM Sans — added in layout.tsx via next/font/google
```

---

## PROMPT 1 — Design Tokens & Global CSS

**File to edit:** `tailwind.config.ts` and `src/app/globals.css`

```
I am redesigning a Next.js 14 + Tailwind CSS 3.4.1 website called OneShot Manufacturing.
Update the files below to set up the design system.

---

FILE: tailwind.config.ts
Extend the theme with these custom colors:
  black: '#080808'
  dark-1: '#111111'
  dark-2: '#1A1A1A'
  dark-3: '#242424'
  dim: '#444444'
  grey: '#888888'
  white-text: '#F2F2F2'
  red: '#C0392B'
  red-hover: '#E74C3C'
  red-dim: '#7B241C'

---

FILE: src/app/globals.css
Add these as CSS custom properties on :root — matching the same values as above.
Set html { scroll-behavior: smooth; }
Set body { background: #080808; color: #F2F2F2; }
Add a utility class .section-reveal for scroll animations:
  opacity: 0; transform: translateY(24px); transition: opacity 400ms ease, transform 400ms ease;
Add .section-reveal.visible { opacity: 1; transform: translateY(0); }

---

FILE: src/app/layout.tsx
Import Bebas_Neue and DM_Sans from next/font/google.
Bebas Neue: weight 400, subset latin.
DM Sans: weight [400, 500, 600], subset latin.
Apply both fonts as CSS variables: --font-display and --font-body.
Set the <html> className to apply both variables.
Remove any existing Inter or Outfit font imports.
Keep all existing Supabase/metadata setup intact.
Do NOT add login link or any auth navigation to the layout.
```

---

## PROMPT 2 — Navbar

**New file:** `src/components/layout/Navbar.tsx`

```
Create a Navbar component for OneShot Manufacturing (Next.js 14, Tailwind, TypeScript).

Requirements:
- Fixed to top, full width, z-index 50
- Transparent background when at top of page (scrollY === 0)
- Solid bg-dark-1 with slight shadow when scrolled (use useEffect + useState)
- Height: 64px, content max-w-[1200px] centered with px-6

Left: Logo — text "ONESHOT" in font-display (Bebas Neue), text-2xl, text-white-text

Center (hidden on mobile): Nav links as <a href="#section"> anchor tags
  Links: Services (#services), Why Us (#why-us), Process (#process), Contact (#contact)
  Style: text-[11px] uppercase tracking-[0.12em] text-grey hover:text-red transition-colors

Right: Single button "GET A QUOTE" → href="#contact"
  Style: bg-red hover:bg-red-hover text-white text-[13px] font-semibold px-5 py-2 rounded-[2px] transition-colors

Mobile (md:hidden): Hamburger icon (use Lucide Menu/X) → full-screen dark overlay
  Overlay: fixed inset-0 bg-black z-40, links stacked center, text-2xl
  Close on link click

NO login link. NO /about or /services route links. Only anchor links.
Export as default.
```

---

## PROMPT 3 — Hero Slider

**New file:** `src/components/sections/Hero.tsx`

```
Create a Hero slider component for OneShot Manufacturing (Next.js 14, Tailwind, TypeScript).

Data (define inline at top of file):
const slides = [
  { tag: 'WIRE & CABLE', headline: 'PRECISION WIRING.\nZERO DEFECTS.', sub: 'Custom harnesses built to spec', img: '/images/hero-1.jpg' },
  { tag: 'PCB ASSEMBLY', headline: 'SMT TO MIXED-TECH.\nSTART TO FINISH.', sub: 'Prototype to mid-volume, lead-free', img: '/images/hero-2.jpg' },
  { tag: 'FOR STARTUPS', headline: 'LOW VOLUME.\nHIGH STANDARD.', sub: 'Free pickup & delivery across India', img: '/images/hero-3.jpg' },
]

Requirements:
- Section: id="hero", min-h-screen, relative, overflow-hidden
- Background: Next.js <Image> fill objectFit cover, changes with slide
- Dark overlay div: absolute inset-0, bg-black/55
- Content: absolute, left 10%, top 50% translateY(-50%), max-w-2xl, z-10

Content per slide:
  1. Small red tag: text-[11px] uppercase tracking-[0.15em] text-red, inline-block border border-red px-3 py-1 mb-6
  2. h1: font-display text-[clamp(72px,10vw,130px)] leading-none text-white-text whitespace-pre-line
  3. p: font-body text-[17px] text-grey mt-4
  4. Buttons row mt-8 flex gap-4:
       Ghost: border border-white/40 hover:border-white text-white font-display tracking-wide text-lg px-8 h-12 rounded-[2px] transition-all
       Red: bg-red hover:bg-red-hover text-white font-display tracking-wide text-lg px-8 h-12 rounded-[2px] transition-all

Auto-advance: useEffect setInterval 5000ms, clears on unmount

Bottom progress bar: absolute bottom-0 left-0 h-[3px] bg-red
  Animates width 0%→100% in 5s using CSS animation, resets on slide change (use key prop)

Dot indicators: absolute bottom-6 left-1/2 -translate-x-1/2, flex gap-2
  Each dot: w-2 h-2 rounded-full, active = bg-red, inactive = bg-white/30

Slide transition: crossfade using opacity transition on background image
Export as default.
```

---

## PROMPT 4 — Stats Bar

**New file:** `src/components/sections/Stats.tsx`

```
Create a Stats bar component for OneShot Manufacturing (Next.js 14, Tailwind, TypeScript).

Stats data (inline):
const stats = [
  { number: '8+', label: 'YEARS IN OPERATION' },
  { number: '1000+', label: 'PROJECTS EXPERIENCE' },
  { number: '99%', label: 'ON-TIME DELIVERY' },
  { number: '50+', label: 'ACTIVE CLIENTS' },
]

Requirements:
- Section: bg-dark-2, py-10
- Inner: max-w-[1200px] mx-auto px-6
- Layout: grid grid-cols-2 md:grid-cols-4, divide each item with 1px vertical border in dark-3
- Each stat: text-center, px-8

Per stat:
  Number: font-display text-[56px] leading-none text-white-text
  Label: font-body text-[11px] uppercase tracking-[0.12em] text-grey mt-2

Export as default.
```

---

## PROMPT 5 — Services Section

**New file:** `src/components/sections/Services.tsx`

```
Create a Services section component for OneShot Manufacturing (Next.js 14, Tailwind, TypeScript).

Data (inline):
const services = [
  { title: 'Wire & Cable Preparation', desc: 'Custom harnesses, crimping, harness assembly, end-to-end processing', img: '/images/wire.jpg' },
  { title: 'PCB Assembly', desc: 'SMT, THT, mixed-tech — prototype to mid-volume production', img: '/images/pcb.jpg' },
  { title: 'Raw Material Sourcing', desc: 'Buyer-supplied, we-procure, or hybrid procurement models', img: '/images/sourcing.jpg' },
]

Requirements:
- Section: id="services", bg-black, py-28
- Inner: max-w-[1200px] mx-auto px-6
- Header: <SectionTag>OUR SERVICES</SectionTag> then <SectionHeading>WHAT WE BUILD</SectionHeading>
- Cards grid: grid grid-cols-1 md:grid-cols-3 gap-5 mt-14

Each card:
  Container: bg-dark-2 border-t-2 border-red rounded-[2px] overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200
  Image: Next.js Image, h-[220px], objectFit cover, w-full
  Body: p-6
    Title: font-body font-semibold text-[18px] text-white-text
    Desc: font-body text-[14px] text-grey mt-2 leading-relaxed
    Link: font-body text-[13px] text-red mt-4 inline-block hover:underline → "→ Learn more"

Create SectionTag and SectionHeading as small inline components at top of this file if not yet extracted.
Export as default.
```

---

## PROMPT 6 — Why Us Section

**New file:** `src/components/sections/WhyUs.tsx`

```
Create a Why Us section for OneShot Manufacturing (Next.js 14, Tailwind, TypeScript).

Data (inline):
const values = [
  { title: 'Computer Vision QC', desc: 'Every unit inspected by CV + human double-check' },
  { title: 'Cable Tracking & Tagging', desc: 'Labeled, tracked, photographed per unit' },
  { title: 'Free Pickup & Delivery', desc: 'Door-to-door logistics anywhere in India' },
  { title: 'ESD-Safe Handling', desc: 'ISO-compliant from bench to box' },
  { title: 'Fast Turnaround', desc: 'Short cycles built for hardware iteration' },
  { title: 'Startup-Friendly MOQ', desc: 'No minimum too small' },
]

Requirements:
- Section: id="why-us", bg-dark-1, overflow-hidden
- Layout: grid grid-cols-1 md:grid-cols-[2fr_3fr], no gap

Left col:
  Full-height image: Next.js Image, fill, objectFit cover, src="/images/factory.jpg"
  Wrap in relative div with min-h-[400px] md:min-h-full

Right col:
  Padding: p-12 md:p-16, flex flex-col justify-center
  <SectionTag>OUR EDGE</SectionTag>
  <SectionHeading>WHY ONESHOT</SectionHeading>
  
  Value list: flex flex-col gap-6 mt-10
  Each row:
    Container: flex items-start gap-4
    Red dot: w-2 h-2 min-w-[8px] rounded-full bg-red mt-[6px]
    Text div:
      Title: font-body font-semibold text-[16px] text-white-text
      Desc: font-body text-[14px] text-grey mt-0.5

Export as default.
```

---

## PROMPT 7 — PCB Quality Section

**New file:** `src/components/sections/PcbQuality.tsx`

```
Create a PCB Quality section for OneShot Manufacturing (Next.js 14, Tailwind, TypeScript).

Data (inline):
const pcbPoints = [
  { title: 'Short Turnaround', desc: 'Fast cycles for rapid hardware iteration' },
  { title: 'Lead-Free Solder', desc: 'RoHS-compliant, safe for your team' },
  { title: 'Digitally Controlled Reflow', desc: 'Oven settings managed by software, not guesswork' },
  { title: 'Computer Vision Inspection', desc: 'Every board verified under microscope + CV' },
  { title: 'ESD-Safe Environment', desc: 'Grounded, gloved, ISO-handled throughout' },
  { title: 'ESD Packaging', desc: 'Anti-static packaging, boards arrive intact' },
]

Requirements:
- Section: id="pcb", bg-black, py-28
- Inner: max-w-[1200px] mx-auto px-6
- <SectionTag>PCB PROCESS</SectionTag>
- <SectionHeading>PCB ASSEMBLY QUALITY</SectionHeading>
- Grid: grid grid-cols-1 md:grid-cols-3 gap-5 mt-14

Each card:
  bg-dark-2 border border-dark-3 border-t-2 border-t-red p-6 rounded-[2px]
  hover:-translate-y-1 transition-transform duration-200
  Title: font-body font-semibold text-[16px] text-white-text
  Desc: font-body text-[14px] text-grey mt-2 leading-relaxed

Export as default.
```

---

## PROMPT 8 — Add-ons Section

**New file:** `src/components/sections/Addons.tsx`

```
Create an Add-ons section for OneShot Manufacturing (Next.js 14, Tailwind, TypeScript).

Data (inline):
const addons = [
  'QC Report & Data', 'Per-Unit Photos', 'Cable Tagging', 'Cut-to-Length',
  'Firmware Flashing', 'Continuity Testing', 'Partial Assembly', 'Conformer Coating', 'Potting',
]

Requirements:
- Section: id="addons", bg-dark-1, py-28, text-center
- Inner: max-w-[1200px] mx-auto px-6
- <SectionTag center>EXTRAS</SectionTag>
- <SectionHeading center>OPTIONAL ADD-ONS</SectionHeading>
- Subtext: font-body text-[14px] text-grey mt-4
  "Available at additional cost. Mention when requesting a quote."

- Badges container: flex flex-wrap justify-center gap-3 mt-12

Each badge:
  <span> border border-red-dim text-white-text font-body text-[13px]
         px-4 py-2 rounded-[2px] cursor-default
         hover:bg-red-dim transition-colors duration-150

Export as default.
```

---

## PROMPT 9 — Process Section

**New file:** `src/components/sections/Process.tsx`

```
Create a Process (How It Works) section for OneShot Manufacturing (Next.js 14, Tailwind, TypeScript).

Data (inline):
const steps = [
  { number: '01', title: 'Inquiry', desc: 'Share requirements via the quote form or email' },
  { number: '02', title: 'Design Review', desc: 'Engineers confirm specs and suggest optimizations' },
  { number: '03', title: 'Production', desc: 'Precision manufacturing with in-process QC' },
  { number: '04', title: 'Delivery', desc: 'Packaged, labeled, shipped on time' },
]

Requirements:
- Section: id="process", bg-black, py-28
- Inner: max-w-[1200px] mx-auto px-6
- <SectionTag>PROCESS</SectionTag>
- <SectionHeading>HOW IT WORKS</SectionHeading>

- Steps wrapper: relative grid grid-cols-1 md:grid-cols-4 gap-8 mt-14

Desktop connector line: hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px
  border-top: 2px dashed border-red/40 (z-0)

Each step: relative z-10
  Number: font-display text-[48px] text-red leading-none
  Title: font-body font-semibold text-[16px] text-white-text mt-3
  Desc: font-body text-[13px] text-grey mt-1 leading-relaxed

Export as default.
```

---

## PROMPT 10 — Contact Section

**New file:** `src/components/sections/Contact.tsx`

```
Create a Contact section for OneShot Manufacturing (Next.js 14, Tailwind, TypeScript, Supabase).

Import createClient from '@/lib/supabase' (existing file — do not modify it).

Form state: { name, email, phone, company, message, file } + errors object + isSubmitting + isSuccess

Requirements:
- Section: id="contact", bg-dark-1, py-28
- Inner: max-w-[1200px] mx-auto px-6
- <SectionTag>CONTACT</SectionTag>
- <SectionHeading>GET IN TOUCH</SectionHeading>

- Panel grid: grid grid-cols-1 md:grid-cols-2 gap-0 mt-14 rounded-[2px] overflow-hidden

LEFT panel (Info): bg-dark-2 p-10 md:p-12
  Contact details displayed as:
    Label: font-body text-[11px] uppercase tracking-[0.12em] text-grey mb-1
    Value: font-body text-[15px] text-white-text mb-6
  Details:
    ADDRESS: L140, MIDC, Ahilyanagar, Maharashtra, India - 414111
    PHONE: +91 95884 46409
    EMAIL: info@oneshotmanufacturing.com
    HOURS: Monday – Saturday, 9:00 AM – 6:00 PM IST
  NO map embed.

RIGHT panel (Form): bg-dark-2 border-l border-dark-3 p-10 md:p-12
  Show success message if isSuccess === true (no form).
  
  Fields layout (flex flex-col gap-5):
    Full Name* — text input, required
    Email* — email input, required
    Phone* — tel input, required
    Company — text input, optional
    Message* — textarea 4 rows, required
    Attachment — file input (accept pdf,jpg,png,dxf), optional

  Input styles:
    Label: font-body text-[11px] uppercase tracking-[0.12em] text-grey mb-1 block
    Input/textarea: w-full bg-dark-3 border border-dim focus:border-red outline-none
                    text-white-text font-body text-[15px] px-4 py-3 rounded-[2px] transition-colors
    Error: border-red-500 — show small red error text below input (text-[12px] text-red)

  Submit button: w-full bg-red hover:bg-red-hover text-white font-display
                 tracking-wide text-[22px] h-[52px] rounded-[2px] transition-colors mt-2
                 Text: "SEND MESSAGE →", disabled + opacity-60 when isSubmitting

  On submit: validate required fields, insert into Supabase 'contact_submissions' table
  (fields: name, email, phone, company, message, created_at). File upload is optional
  and can be skipped for now. On success set isSuccess = true.

Export as default.
```

---

## PROMPT 11 — Footer

**New file:** `src/components/layout/Footer.tsx`

```
Create a Footer component for OneShot Manufacturing (Next.js 14, Tailwind, TypeScript).

Requirements:
- bg-black border-t border-dark-3

Upper section: max-w-[1200px] mx-auto px-6 py-14
  Grid: grid grid-cols-2 md:grid-cols-4 gap-10

  Col 1:
    "ONESHOT" in font-display text-[22px] text-white-text
    "Precision Wiring & Assembly Solutions" in font-body text-[13px] text-grey mt-2
    "GSTIN: 2727272727272727" in font-body text-[11px] text-dim mt-4

  Col 2 — Quick Links (anchor tags to sections):
    Heading: font-body text-[11px] uppercase tracking-wide text-grey mb-4
    Links: [Services, Why Us, Process, Contact]
    Link style: font-body text-[14px] text-grey hover:text-white-text block mb-2 transition-colors

  Col 3 — Company:
    Heading same style
    Links: [Quality Standards, ESD Policy, About]
    (these are placeholder text links — href="#" for now)

  Col 4 — Contact:
    Heading same style
    Items (no links, just text):
      +91 95884 46409
      info@oneshotmanufacturing.com
      Mon–Sat, 9AM–6PM IST
    Style: font-body text-[13px] text-grey block mb-2

Bottom bar: border-t border-dark-3 py-6
  max-w-[1200px] mx-auto px-6
  flex justify-between items-center flex-wrap gap-2
  Left: "© 2026 OneShot Manufacturing. All rights reserved." — text-[12px] text-dim
  Right: "L140, MIDC, Ahilyanagar, Maharashtra — 414111" — text-[12px] text-dim

Export as default.
```

---

## PROMPT 12 — Assemble page.tsx

**File to edit:** `src/app/page.tsx`

```
Rewrite src/app/page.tsx for OneShot Manufacturing.
This is a single-page site — all sections live here, no routing except /admin.

Import and render in this exact order:
  import Navbar from '@/components/layout/Navbar'
  import Hero from '@/components/sections/Hero'
  import Stats from '@/components/sections/Stats'
  import Services from '@/components/sections/Services'
  import WhyUs from '@/components/sections/WhyUs'
  import PcbQuality from '@/components/sections/PcbQuality'
  import Addons from '@/components/sections/Addons'
  import Process from '@/components/sections/Process'
  import Contact from '@/components/sections/Contact'
  import Footer from '@/components/layout/Footer'

Also add a scroll-reveal effect:
  useEffect: query all elements with class .section-reveal
  Create IntersectionObserver: when element enters viewport (threshold 0.15),
  add class .visible to it. Observe all matching elements.

Return:
  <main>
    <Navbar />
    <Hero />
    <Stats />
    <Services />
    <WhyUs />
    <PcbQuality />
    <Addons />
    <Process />
    <Contact />
    <Footer />
  </main>

Add metadata export:
  title: "OneShot Manufacturing — Precision Wiring & PCB Assembly"
  description: "Contract electronics manufacturing in India. Wire harness assembly, PCB assembly, SMT, THT. Startup-friendly MOQ. Free pickup & delivery."
```

---

## AFTER ALL PROMPTS — Manual Steps

```bash
# 1. Download real photos and place in public/images/
#    Reference: https://pel-india.in/cable-harness/ (cable photos)
#    Reference: https://inyantra.com/cable-wiring-harness-assembly/ (crimp photos)
#    Files needed: hero-1.jpg, hero-2.jpg, hero-3.jpg, wire.jpg, pcb.jpg, sourcing.jpg, factory.jpg

# 2. Create the Supabase table for contact form
#    Table name: contact_submissions
#    Columns: id (uuid, PK), name (text), email (text), phone (text),
#             company (text, nullable), message (text), created_at (timestamp default now())

# 3. Test the site:
npm run dev
# Open http://localhost:3000 — verify all sections visible, anchor links work, form submits

# 4. Verify /admin still works (should be unchanged)
#    Open http://localhost:3000/admin — login should work as before

# 5. Build for production:
npm run build
npm run start
```

---

## NOTES FOR QWEN 2.5 CODER

- Always use TypeScript with proper types
- Always use `'use client'` at top of files with useState/useEffect
- Use Next.js `<Image>` component for all images (not `<img>`)
- Keep all Supabase logic from existing `src/lib/supabase.ts` — don't rewrite it
- If a component references SectionTag or SectionHeading, define them as small inline components in the same file until they are extracted to /components/ui/
- Tailwind classes: use the custom token names (bg-dark-2, text-grey, etc.) as defined in tailwind.config.ts
- Do not add any route-based navigation. All links are anchor tags (#section-id).


