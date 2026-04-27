# FILE 1 — VISUAL DESIGN SPEC
## OneShot Manufacturing — Single Page Website

---

## DESIGN LANGUAGE

**Mood:** Industrial precision. Think tool catalog meets luxury product site.
**Reference:** Tesla.com structure, but darker and more raw.
**Rule:** If it doesn't need to be there, remove it.

---

## COLOR SYSTEM

```
Background layers (dark to light):
  --black:        #080808   ← page background
  --dark-1:       #111111   ← section alternates
  --dark-2:       #1A1A1A   ← cards, panels
  --dark-3:       #242424   ← hover states, borders

Text:
  --white:        #F2F2F2   ← primary text
  --grey:         #888888   ← secondary / captions
  --dim:          #444444   ← disabled / dividers

Accent (use sparingly):
  --red:          #C0392B   ← CTAs, highlights, icon dots, tags
  --red-hover:    #E74C3C   ← button hover only
  --red-dim:      #7B241C   ← subtle backgrounds, badge fills
```

**Rules for color use:**
- Red is ONLY on: CTA buttons, active nav links, section tags, icon accents, progress bars
- Never use red for body text or card backgrounds
- Every other section alternates between `--black` and `--dark-1` for rhythm

---

## TYPOGRAPHY

```
Display (Hero headings):        Bebas Neue — size: clamp(72px, 10vw, 130px)
Section headings:               Bebas Neue — size: clamp(40px, 5vw, 72px)
Card titles:                    DM Sans 600 — 18px
Body:                           DM Sans 400 — 15px, line-height 1.6
Labels / tags / captions:       DM Sans 500 — 11px, letter-spacing: 0.12em, UPPERCASE
```

**Install via next/font/google:**
```ts
import { Bebas_Neue, DM_Sans } from 'next/font/google'
```

---

## SPACING & LAYOUT

```
Max content width:    1200px (centered, px-6 on mobile)
Section padding:      py-28 (desktop), py-16 (mobile)
Card gap:             gap-5
Grid:                 CSS Grid only (no Flexbox for multi-col)
Border radius:        2px everywhere — sharp, industrial
```

---

## SINGLE PAGE STRUCTURE (top to bottom)

```
┌─────────────────────────────────┐
│  NAVBAR (sticky)                │  → anchor links only
├─────────────────────────────────┤
│  HERO                           │  #hero     → fullscreen, slider
├─────────────────────────────────┤
│  STATS BAR                      │  → 4 numbers, no anchor
├─────────────────────────────────┤
│  SERVICES                       │  #services → 3 cards
├─────────────────────────────────┤
│  WHY US                         │  #why-us   → 6 value points
├─────────────────────────────────┤
│  PCB QUALITY                    │  #pcb      → 6 cards
├─────────────────────────────────┤
│  ADD-ONS                        │  #addons   → pill badges
├─────────────────────────────────┤
│  PROCESS                        │  #process  → 4 steps
├─────────────────────────────────┤
│  CONTACT                        │  #contact  → form + info
├─────────────────────────────────┤
│  FOOTER                         │  → links + GSTIN
└─────────────────────────────────┘
```

---

## SECTION-BY-SECTION VISUAL SPEC

---

### NAVBAR

```
Background: transparent → --dark-1 on scroll (transition: 300ms)
Height: 64px
Content: [ONESHOT logo] ────────── [Services] [Why Us] [Process] [Contact] ── [GET A QUOTE ▶]

Logo: "ONESHOT" — Bebas Neue, 26px, --white
Nav links: DM Sans, 12px, uppercase, tracking-wide — hover: --red
CTA button: bg --red, --white text, DM Sans 13px bold, px-5 py-2, radius 2px
Mobile: hamburger → full-screen --black overlay, links stacked center, 32px
No login link. No about link.
```

---

### HERO — Full Screen Slider

```
Height: 100vh
Background: real photo, full bleed, dark overlay rgba(0,0,0,0.55)
Layout: content left-aligned, vertically centered

Per-slide layout:
  [TAG]         → red pill, 11px uppercase — e.g. "WIRE & CABLE ASSEMBLY"
  [HEADLINE]    → Bebas Neue, clamp(72px, 10vw, 130px), --white, max 4 words/line
  [SUBLINE]     → DM Sans 17px, --grey, 1 line max
  [BUTTONS]     → [VIEW SERVICES →]  [GET A QUOTE]
                  First: ghost/outline white. Second: red filled.
                  Both: height 48px, px-8, radius 2px, Bebas Neue 18px

Bottom: thin red progress bar (full width, animates left→right per slide duration)
        + dot indicators, centered

3 Slides:
  1. Tag: "WIRE & CABLE"      | Headline: "PRECISION WIRING. ZERO DEFECTS."       | Sub: "Custom harnesses built to spec"
  2. Tag: "PCB ASSEMBLY"      | Headline: "SMT TO MIXED-TECH. START TO FINISH."    | Sub: "Prototype to mid-volume, lead-free"
  3. Tag: "FOR STARTUPS"      | Headline: "LOW VOLUME. HIGH STANDARD."             | Sub: "Free pickup & delivery across India"
```

---

### STATS BAR

```
Background: --dark-2
Height: auto, py-10
Layout: 4 columns, centered, dividers between each

Per stat:
  [NUMBER]  → Bebas Neue, 56px, --white
  [LABEL]   → DM Sans, 11px, --grey, uppercase, tracking-wide

Stats: 8+ Years | 1000+ Projects | 99% On-Time | 50+ Clients
```

---

### SERVICES — #services

```
Background: --black
Heading: "WHAT WE BUILD"  (section tag above: "OUR SERVICES")

Layout: 3-column grid

Each card:
  - Real photo top, height 220px, object-cover
  - Below: thin red top border (2px)
  - Card bg: --dark-2, padding 24px
  - Title: DM Sans 600, 18px, --white
  - 2-line desc: DM Sans 14px, --grey
  - "→ Learn more" — DM Sans 13px, --red, no underline

3 services:
  1. Wire & Cable Preparation
  2. PCB Assembly
  3. Raw Material Sourcing
```

---

### WHY US — #why-us

```
Background: --dark-1
Heading: "WHY ONESHOT"

Layout: Asymmetric 2-col.
  Left (40%): real photo, full height, object-cover, dark overlay
  Right (60%): vertical stack of 6 value rows

Each value row:
  [●] [TITLE]       ← red dot 8px, DM Sans 600 16px, --white
      [description] ← DM Sans 14px, --grey, 1 line

6 values:
  ● Computer Vision QC        → Every unit inspected by CV + human double-check
  ● Cable Tracking & Tagging  → Labeled, tracked, photographed per unit
  ● Free Pickup & Delivery    → Door-to-door logistics anywhere in India
  ● ESD-Safe Handling         → ISO-compliant from bench to box
  ● Fast Turnaround           → Short cycles built for hardware iteration
  ● Startup-Friendly MOQ      → No minimum too small
```

---

### PCB QUALITY — #pcb

```
Background: --black
Heading: "PCB ASSEMBLY QUALITY"

Layout: 3×2 grid (3 cols, 2 rows = 6 cards)

Each card:
  bg: --dark-2
  border: 1px solid --dark-3
  border-top: 2px solid --red  (accent stripe)
  padding: 24px
  Title: DM Sans 600, 16px, --white
  Body: DM Sans 14px, --grey, 2 lines max

6 cards:
  1. Short Turnaround          → Fast cycles for rapid hardware iteration
  2. Lead-Free Solder          → RoHS-compliant, safe for your team
  3. Digitally Controlled Reflow → Oven temp and time set by software, not guesswork
  4. Computer Vision Inspection → Every board verified under microscope + CV
  5. ESD-Safe Environment      → Grounded, gloved, ISO-handled components
  6. ESD Packaging             → Anti-static packaging, boards arrive intact
```

---

### ADD-ONS — #addons

```
Background: --dark-1
Heading: "OPTIONAL ADD-ONS"
Subtext: "Available at additional cost. Mention when requesting a quote."

Layout: Centered flex-wrap of pill badges

Each badge:
  border: 1px solid --red-dim
  bg: transparent
  color: --white
  font: DM Sans 13px
  padding: 8px 16px
  radius: 2px
  hover: bg --red-dim

9 badges:
  QC Report & Data | Per-Unit Photos | Cable Tagging | Cut-to-Length |
  Firmware Flashing | Continuity Testing | Partial Assembly | Conformer Coating | Potting
```

---

### PROCESS — #process

```
Background: --black
Heading: "HOW IT WORKS"

Layout: 4-column horizontal stepper (desktop) / vertical stack (mobile)
Connector: horizontal dashed red line between steps on desktop

Each step:
  Number: Bebas Neue 48px, --red (01, 02, 03, 04)
  Title: DM Sans 600, 16px, --white
  Body: DM Sans 13px, --grey, 2 lines

4 steps:
  01 Inquiry       → Share requirements via the quote form or email
  02 Design Review → Engineers confirm specs and suggest optimizations
  03 Production    → Precision manufacturing with in-process QC
  04 Delivery      → Packaged, labeled, shipped on time
```

---

### CONTACT — #contact

```
Background: --dark-1
Heading: "GET IN TOUCH"

Layout: 2-column
  Left (dark panel, bg --dark-2, padding 48px):
    Company name, address (text only, no map), phone, email, hours
    Style: labels in --grey 11px uppercase, values in --white 15px

  Right (form panel, bg --dark-2, padding 48px):
    Fields:
      Full Name*     → text input
      Email*         → email input
      Phone*         → tel input
      Company        → text input (optional)
      Message*       → textarea, 4 rows
      Attachment     → file upload (optional)

    Input style:
      bg: --dark-3
      border: 1px solid --dim
      border-radius: 2px
      color: --white
      focus: border --red
      label: DM Sans 11px, --grey, uppercase, mb-1

    Submit: full-width, bg --red, hover --red-hover
            Bebas Neue 22px, height 52px, "SEND MESSAGE →"
```

---

### FOOTER

```
Background: --black
Border-top: 1px solid --dark-3

Layout: 4 columns + bottom bar

Col 1: "ONESHOT" logo + "Precision Wiring & Assembly Solutions" + GSTIN
Col 2: Quick links → Services, Why Us, Process, Contact
Col 3: Legal/Info → Quality Standards, ESD Policy, About
Col 4: Contact → phone, email, address, hours

Bottom bar:
  Left: © 2026 OneShot Manufacturing
  Right: L140, MIDC, Ahilyanagar, Maharashtra — 414111
  Font: DM Sans 12px, --grey
```

---

## INTERACTION & ANIMATION RULES

```
Scroll reveal:    Sections fade-up on enter (translateY 24px → 0, opacity 0→1, 400ms ease)
Hover states:     All interactive elements: 200ms ease transition
Nav scroll:       Smooth scroll to anchor sections
Progress bar:     Hero slide progress: CSS animation, width 0→100%, duration 5s, resets on slide change
Button hover:     Scale 1.02, bg color shift, 150ms
Card hover:       translateY -4px, box-shadow 0 8px 24px rgba(0,0,0,0.4)
No:               Parallax, heavy 3D transforms, particle effects
```

---

## WHAT NOT TO DO

```
✗ No glassmorphism (backdrop-blur cards)
✗ No purple/blue gradients
✗ No rounded-2xl or rounded-full on layout elements
✗ No AI-generated images
✗ No login link visible on site
✗ No separate page routes (/about, /services, /contact)
✗ No paragraph blocks — use short lines, tags, bullet rows
✗ No more than 2-3 sentences per section description
```
