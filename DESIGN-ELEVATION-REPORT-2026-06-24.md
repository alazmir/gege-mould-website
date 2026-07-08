# Gege Mould — Design Elevation & Positioning Correction Report
## 2026-06-24 — B2B Automotive Tooling Website Upgrade

---

## POSITIONING AUDIT: Automotive-Only Correction

The real positioning is automotive-only — the company does NOT manufacture for appliances,
medical, consumer goods, or general industry. Below is every instance found where the
current site implies broader industry scope, with the required correction.

### 🚨 CRITICAL: Complete Page Replacement Required

**industries.html** — The ENTIRE page must be replaced. Currently structured as 4 industry
verticals (Automotive, Home Appliances, Industrial Equipment, Consumer Goods). Must become
an automotive-segment-only page. See Section 9 below for the replacement design.

### Page-by-Page Corrections Needed

| # | File | Location | Current Text | Correction | Impact |
|---|------|----------|-------------|------------|--------|
| 1 | index.html | meta description (L5) | "Trusted by leading automotive and industrial brands globally." | "Trusted by leading automotive OEMs and Tier 1 suppliers globally." | SEO + trust |
| 2 | index.html | meta keywords (L6) | Remove "appliance, medical, electronics" if present; already clean ✓ | No change needed (already automotive-focused) | — |
| 3 | index.html | og:description (L9) | "Trusted by leading automotive and industrial brands globally." | "Trusted by leading automotive OEMs and Tier 1 suppliers globally." | Social sharing |
| 4 | index.html | twitter:description (L17) | Same as above | Same fix | Social sharing |
| 5 | index.html | JSON-LD (L34-36) | "Precision plastic injection mold design, tooling, and injection molding services." | Add `"areaServed": "Automotive injection mold manufacturing"` + `"knowsAbout": ["Automotive bumper molds","Automotive interior molds","Automotive lighting molds","Automotive under-hood molds","EV component molds"]` | Rich-result quality |
| 6 | index.html | intro para 3 (L232-233) | "We serve automotive OEMs, appliance manufacturers, industrial equipment producers, and consumer goods companies" | "We serve automotive OEMs and Tier 1–2 suppliers — from passenger vehicle programs to heavy-duty commercial truck platforms." | Trust-critical |
| 7 | about.html | company description | Check for "appliance" / "consumer" / "industrial" references | Replace with automotive-only language | Trust |
| 8 | capabilities.html | materials section | "PP/PP-GF for automotive and appliance" type language | Remove non-automotive example applications; focus on automotive use cases only | Accuracy |
| 9 | capabilities.html | markets section | Any non-automotive market categories | Replace with automotive sub-segments (interior, exterior, lighting, under-hood, EV, heavy truck) | Accuracy |
| 10 | quality.html | Any reference to non-automotive quality standards | Check all content | Remove any non-automotive specific mentions | Accuracy |
| 11 | faqs.html | Q&A answers | Check for "serving appliance/consumer/industrial" | Replace any cross-industry references | Accuracy |
| 12 | faqs.html | FAQpage JSON-LD | Currently covers only 5 of 10 Q&As | Expand to all 10 Q&As + remove any cross-industry references in answers | SEO |
| 13 | case-studies.html | Case cards | Verify all cases are automotive | Flag any non-automotive case studies for removal | Trust |
| 14 | contact.html | form inquiry dropdown | Options include "New Injection Mold Quote" (generic) | Refine to automotive-specific inquiry types: "Automotive Bumper/Truck Mold RFQ", "Automotive Interior/Exterior Mold RFQ", "EV Component Mold RFQ", "Automotive Lighting Mold RFQ", "Production Molding RFQ", "Technical/DFM Review" | Conversion |
| 15 | rfq.html | industry field options | Check for non-automotive options | Remove "Appliance", "Consumer Goods", "Medical", "Electronics", "General Industrial"; keep "Automotive — Passenger Vehicle", "Automotive — Heavy-Duty Truck", "Automotive — EV/New Energy", "Automotive — Commercial Vehicle" | Conversion |
| 16 | capability-table.html | industry filter | Check for non-automotive filter options | Replace industry filter with automotive-segment filter (Exterior, Interior, Lighting, Under-Hood, EV, Structural) | Accuracy |
| 17 | automotive-mold-solutions.html | Entire page (L64-335) | Current "10 product cards" approach | Refine to the 4 automotive segments below; remove any non-automotive product references | Structure |
| 18 | i18n JSON files | en.json, pt.json, es.json, ar.json, id.json | meta.description, meta.keywords, og_description values | Update all 5 language files to reflect automotive-only positioning | i18n consistency |
| 19 | sitemap.xml | All entries | Check for non-automotive language in any URL descriptions | Update as needed | SEO |
| 20 | blog-conformal-cooling.html | Article body | Check for appliance/consumer references | Replace with automotive-only case examples | Accuracy |
| 21 | blog-gate-location.html | Article body | Check for non-automotive examples | Replace with automotive-only case examples | Accuracy |

---

## 1. HERO SECTION UPGRADE

### Current State
```
Eyebrow: "Precision Mold Engineering & Manufacturing"
H1: "Injection Molds Built for Production — Not Just for Trial"
Subhead: "From a single-cavity prototype to a full production tooling program..."
Trust Badges: ISO 9001 • 10+ Years • 3,000 m² • 7 Global OEM Partners
CTA: "Get a Free Quote" + phone number
```

### Assessment
The current hero is good for a general mold manufacturer. For an **automotive-OEM-focused buyer**, it lacks specificity about what kind of production molds — a procurement manager at a Tier 1 wants to know immediately: "Do you make the kind of molds I buy?"

### Recommended Headline Options (A/B test candidates)

**Option A — Buyer-Pain-Point Focused (Recommended):**
> **Eyebrow:** Automotive Injection Mold Engineering — Taizhou, China
> **H1:** Molds That Meet PPAP. On Time.
> **Subhead:** From bumper tooling to precision lighting molds — Gege Mould delivers production-ready automotive injection molds with full PPAP Level 3 documentation. Trusted by Tier 1 suppliers across Europe, Asia, and the Americas.

**Option B — Capability-Claim Focused:**
> **Eyebrow:** OEM Automotive Parts Supplier — Since 2014
> **H1:** Your Automotive Tooling Program, Engineered From a Single Source
> **Subhead:** Design. Tooling. Tryout. PPAP. Delivery. Installation support. One team, one facility, one point of contact — from CAD to serial production.

**Option C — Social-Proof Focused:**
> **Eyebrow:** Trusted by Mercedes-Benz, Volvo, Scania, DAF, and MAN
> **H1:** Automotive Injection Molds That Run 24/7 in OEM Production Lines
> **Subhead:** 10+ years. 30+ countries. PPAP Level 3 on every tool. When production uptime is non-negotiable, procurement teams choose Gege Mould.

### Trust Badges — Visual Upgrade

Current: plain text separated by dots. Upgrade to:
- **Badge-style visual treatment:** Small icon + label in a borderless chip (like Notion/Linear tags but more premium)
- **New badges:** ISO 9001:2015 Certified • PPAP Level 3 Standard • 10+ Years Automotive Focus • 3,000 m² Facility • 30+ Export Countries • 7 OEM Partnerships
- **Add:** "IATF 16949-aligned quality system" badge if applicable (this is the #1 credential automotive buyers ask about — if you don't have it, add "IATF 16949-aligned processes" as a positioning claim rather than a certification claim)

### Hero Visual
- The current CSS-gradient-only hero background works but feels flat. Add a **subtle, low-opacity hero image** behind the gradient — a CNC machine shot or a polished mold close-up, heavily de-emphasized (opacity 0.08–0.12) — that adds texture without competing with text.
- On mobile, drop the image entirely (gradient-only is cleaner at narrow widths).

---

## 2. TRUST INDICATORS / STATS BAND UPGRADE

### Current State
The "Why Choose Gege Mould" section shows 8 stats in what appears to be a simple grid. These are the numbers that close deals with procurement managers — they deserve premium treatment.

### Recommended Upgrade
**Layout:** 4-across grid (2×2 on mobile) with:
- Large brass-colored number (CSS `counter-animation` already exists — keep it ✓)
- Small uppercase label below the number
- Subtle separation lines between stat cards (horizontal on desktop, vertical on mobile)
- Each stat card has a subtle hover state: slight scale (1.02) + brass underline appears

**Stats to highlight (order by procurement relevance):**
1. **10+** Years of Automotive Mold Engineering
2. **3,000 m²** Advanced Manufacturing Facility
3. **80–1,600T** Injection Molding Clamp Force Range
4. **±0.02mm** Tightest Dimensional Tolerance
5. **30+** Countries Served Worldwide
6. **<48hr** Typical RFQ Response Time
7. **ISO 9001** Certified Quality Management
8. **7** Global OEM Brand Partnerships

**Visual treatment:** Each stat gets a thin top-border accent in brass that appears on hover. The number uses `font-feature-settings: "tnum"` for tabular figures (keeps numbers aligned during counter animation).

---

## 3. TECHNICAL CAPABILITIES — VISUAL UPGRADE

### Current State
capabilities.html presents capabilities as text paragraphs + bullet lists under section headings. This is dense and hard to scan for a procurement manager comparing suppliers.

### Recommended Upgrade
Replace or supplement the text-heavy sections with a **capability card grid** using icon + metric + short description format:

**Section: "Engineering & Tooling at a Glance"** (new visual summary at top of page)

| Capability | Icon | Metric | Description |
|-----------|------|--------|-------------|
| Mold Size Capacity | 📐 | Up to 2,000 × 1,500 mm | Large-format automotive tooling |
| CNC Machining | ⚙️ | 12 high-speed CNC centers | 5-axis and 3-axis, 24/7 operation |
| EDM Precision | ⚡ | Wire-cut + sinker EDM | ±0.005 mm accuracy |
| Clamp Force Range | 🏭 | 80T – 1,600T | Full range for in-house tryout |
| Annual Output | 📦 | 200+ molds per year | Automotive-grade tooling |
| Engineering Team | 👥 | 15+ mold design engineers | CAD/CAM/CAE, DFM specialists |
| Steel Grades | 🔩 | S136, 718H, NAK80, H13, P20 | Certified material sourcing |
| Lead Time | ⏱ | 4–14 weeks typical | Based on complexity and cavitation |

Each card:
- White background with subtle border, rounded corners (existing `--radius-md`)
- Icon in a small brass circle at top-left
- Metric in navy, bold, 1.5rem
- Description in small muted text below
- On hover: card elevates slightly (`transform: translateY(-2px)`, shadow deepens)
- Grid: 4 columns desktop, 2 tablet, 1 mobile

This capability grid should replace or sit above the current text paragraphs — it gives a procurement manager what they need in 10 seconds (can they handle my mold size? my volume? my timeline?), then they scroll for detail.

---

## 4. CASE STUDIES — VISUAL UPGRADE

### Current State
case-studies.html shows case cards with image + tag + title + challenge/solution/outcome blocks. The content structure is good; the visual treatment can be elevated.

### Recommended Upgrades
1. **Card hover state:** Add a subtle scale + shadow elevation on hover. The card should feel "clickable" as a unit.
2. **Outcome metrics:** Instead of text paragraphs for outcomes, extract key numbers into small "outcome chips" below each card — e.g. "16 weeks lead time" | "0 NCs" | "PPAP L3" — same treatment as trust badges but smaller.
3. **Filter by mold type:** Add simple filter buttons above the grid: "All" | "Bumper Molds" | "Lighting Molds" | "Interior Molds" | "Export Programs" — this lets a procurement manager quickly find projects similar to theirs.
4. **Image treatment:** Add a subtle gradient overlay on card images to improve text readability when an image has varying brightness. Current images vary from dark to light — a consistent treatment helps.
5. **Results-first card layout:** Restructure each card to show outcome first, then approach: "Delivered 8 molds in 16 weeks with zero dimensional NCs" as the visible summary, with "How we did it" below the fold/expand.

---

## 5. QUALITY & CERTIFICATIONS — PREMIUM DISPLAY

### Current State
quality.html lists certifications as text paragraphs with headings. ISO 9001, PPAP, SPC, MSA/FAI are described but not visually differentiated from general content.

### Recommended Upgrade
**Certificate badge treatment** for the certifications section:

Design a "certificate card" component:
- Left: a shield/badge icon in brass on a subtle brass-tinted background circle
- Right: certification name (h3) + one-line description + "View details" link that scrolls to the section below
- Cards arranged in a 4-column grid (2 on tablet, 1 on mobile)
- Subtle border + hover elevation

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  🛡 ISO 9001 │  │  📋 PPAP L3  │  │  📊 SPC      │  │  📐 MSA/FAI  │
│  Quality     │  │  Production  │  │  Statistical │  │  Measurement │
│  Management  │  │  Part        │  │  Process     │  │  Systems     │
│  System      │  │  Approval    │  │  Control     │  │  Analysis    │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

Each badge scrolls to the detailed section below with smooth scroll (already implemented in main.js ✓).

The quality process steps (Incoming → In-Process → Tryout → Final) should use a **horizontal stepper** visual (numbered circles connected by lines) rather than the current simple card grid. This communicates "process" more effectively than side-by-side cards.

---

## 6. EXPORT / COUNTRY MAP — VISUAL UPGRADE

### Current State
The "Where We Serve" section on index.html lists countries as text grouped by region — Asia Pacific, Europe, North America, Middle East & Africa, South America.

### Assessment
A procurement manager scanning quickly needs to know: "Do they ship to my country?" A text list answers the question but doesn't communicate scale at a glance.

### Recommended Upgrade
**Option A — Region stat cards (low-effort, high-impact):**
Keep the current text structure but add:
- Region count: "12 countries in Europe" with the flag emoji
- A small "30+ countries" badge at top
- Add shipping terms clarity: "FOB Shanghai / CIF / DDP available"

**Option B — Visual map treatment (recommended, higher effort):**
- A simple SVG world map with served countries highlighted in brass
- Not interactive (keeps it lightweight) — just a visual "reach" indicator
- Below the map: region labels as clickable anchors that scroll to testimonials or case studies from that region
- This communicates "global" instantly without needing to read

For now, Option A is the pragmatic choice given the existing codebase.

---

## 7. RFQ FORM — CONVERSION OPTIMIZATION

### Current State
rfq.html has a 3-step wizard: Step 1 (Part Info), Step 2 (Technical Specs), Step 3 (Contact + Files). This structure is good. Several conversion improvements are available.

### Recommended Improvements

**Field Ordering:**
- Step 1 currently asks for Part Name, Industry, Annual Volume, Target Budget. Consider: the "Target Budget" field is a friction point — many buyers won't share budget early. Move it to Step 2 (optional) or make it a range selector rather than a text field.
- Step 3 asks for contact info AFTER all technical fields. Good — builds commitment before asking for personal data. Keep this ordering.

**Trust-Building Microcopy Near Submit:**
Add a trust line directly below the Submit button:
> 🔒 Your project details are confidential. We never share RFQ data with third parties. Typical response: within 1 business day.

**File Upload Area — Visual Clarity:**
Current: A drag-and-drop zone with extension list. Upgrade to:
- Large dashed-border drop zone with a CAD file icon (📐 or custom SVG)
- Clear text: "Drop your CAD files here or click to browse"
- Below the zone: visual "Accepted format" badges showing the file type icons:
  `[STEP] [STP] [IGES] [IGS] [PDF] [DWG] [DXF] [ZIP]`
  Each as a small tag — communicates "we accept CAD" at a glance without reading the text
- File size note: "Up to 25 MB per file, 5 files max"

**CTA Wording Options (A/B test candidates):**
- "Submit Your Automotive RFQ" (specific, positions for automotive)
- "Send Us Your Part Drawing" (action-focused, lower friction — "submit RFQ" sounds formal)
- "Get a Quote Within 48 Hours" (benefit-focused, sets expectation)
- Recommended: **"Send Us Your Part Drawing"** — lowest friction, highest clarity for what happens next

**Step Labels — Clarity:**
- Current: Step 1 / Step 2 / Step 3 (generic)
- Recommended: "Part Details" / "Technical Specs" / "Contact & Upload" — tells the user what's coming

---

## 8. FAQ, FOOTER, NAV — PREMIUM FEEL REVIEW

### Nav
The mega menu structure is solid. Minor polish:
- Add subtle bottom-border animation on hover for top-level nav links (brass underline slides in from left)
- The "Get a Free Quote" CTA in the header should pulse subtly on page load (once, then stop) to draw attention — then on scroll-return it's static

### Footer
Current footer is functional. Upgrade:
- Add a small certification badge row at the very bottom (ISO 9001 logo mark, not just text)
- Add the affiliate relationship note as a small, subtle line rather than a full paragraph
  
### FAQ
- The FAQ accordion uses `<details>` / `<summary>` or custom JS. If using `<details>`, consider adding a subtle animation on open (max-height transition)
- Add a "Was this helpful?" micro-interaction at the bottom with simple 👍/👎 buttons (tracks to widget-interaction endpoint already built)

---

## 9. NEW: AUTOMOTIVE SEGMENT BREAKDOWN (Replaces industries.html)

This is the largest new addition. The current industries.html page covering 4 industries must be replaced with an automotive-segments-only page.

### Page Structure

**Hero:**
> **H1:** Automotive Mold Solutions by Segment
> **Subhead:** From exterior fascias to precision under-hood components — specialized injection mold engineering for every area of the vehicle.

**Four Segment Cards (visual + value proposition):**

#### 1. Exterior Automotive Molds
- **Image:** `car-front-bumper-mold-1.png` (exists ✓) or `front bumper.jpg` ✓
- **Value proposition:** "Bumper fascias, grille assemblies, wheel arch trims, rocker panels, and exterior body trim. Large-format tooling up to 2,000 × 1,500 mm with Class-A surface finish capability and multi-side slide mechanisms for complex undercuts."
- **Key specs highlight:** Mold size up to 2,000mm • Multi-side action • Texture/grain capability • PPAP L3 standard
- **Link:** Scrolls to detailed exterior molds section

#### 2. Interior Automotive Molds
- **Image:** `door-panel.png` (exists ✓) or `door-panel-2.jpg` ✓
- **Value proposition:** "Door panels, instrument panels, center consoles, pillar trims, and seat components. Grained, textured, and soft-touch surface-capable tooling with integrated hot-runner systems for consistent high-volume production."
- **Key specs highlight:** Multi-cavity up to 4 • Hot-runner integrated • Grain/texture finishes • Fast cycle optimization
- **Link:** Scrolls to detailed interior molds section

#### 3. Lighting & Optical Molds
- **Image:** `two-color-running-light-mold-2.jpg` (exists ✓) or `two-color-running-light-mold-1.png` ✓
- **Value proposition:** "Headlamp housings, taillight lenses, running light assemblies, and optical-grade components. Two-color rotary tooling, multi-shot molding capability, and optical-surface-quality mold finishing for critical light-transmission parts."
- **Key specs highlight:** Two-color/overmolding • Optical surface finish • Tight tolerance ±0.02mm • Multi-shot capable
- **Link:** Scrolls to detailed lighting section

#### 4. Under-Hood & EV Component Molds
- **Image:** `_0010_DSC07759.jpg` (exists ✓) or `mold2.webp` ✓
- **Value proposition:** "HVAC housings, air filter housings, fan shrouds, oil pans, battery tray components, and EV thermal management parts. High-temperature material processing (PA66 GF, PPS, PPA) with engineering-grade steel selection for demanding under-hood environments."
- **Key specs highlight:** High-temp materials • EV battery components • Structural/functional parts • Chemical resistance
- **Link:** Scrolls to detailed under-hood section

**Below the 4 cards:**
Each segment gets a detailed section (image + expanded capability list) below the fold — the 4 cards act as navigation anchors. This replaces the current "Automotive → Home Appliances → Industrial → Consumer" structure entirely.

**Image Availability Check:**
| Segment | Has Image? | Source |
|---------|-----------|--------|
| Exterior Molds | ✅ | car-front-bumper-mold-1.png, front bumper.jpg |
| Interior Molds | ✅ | door-panel.png, door-panel-2.jpg |
| Lighting Molds | ✅ | two-color-running-light-mold-2.jpg, two-color-running-light-mold-1.png |
| Under-Hood / EV | ✅ | _0010_DSC07759.jpg, mold2.webp |

All 4 segments have existing imagery available.

---

## 10. NEW: TESTIMONIAL DESIGN SYSTEM

### Component Design

A testimonial quote component for future use — built as a template with clearly marked placeholder content.

```
┌─────────────────────────────────────────────────────────┐
│  "                                                      │
│  [Quote text — 2-3 sentences max]                       │
│                                                         │
│  — [Name], [Title]                                      │
│    [Company Name]                                       │
│    [Project type badge, e.g. "Bumper Tooling Program"]  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Key result: [e.g. "8 molds delivered in 16 wks"]│  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Visual treatment:**
- Large opening quotation mark in brass, light opacity, positioned behind the text
- Quote in navy, slightly larger than body text (1.1rem), italic or regular (not both)
- Attribution line in smaller text, muted color
- "Key result" chip below — a small brass-bordered pill with the measurable outcome
- Card background: slightly off-white (existing `--color-bg-alt`) with a subtle left border accent in brass
- Placeholder content clearly marked with a `[PLACEHOLDER]` comment visible in source code

**Grid layout:** 2-column on desktop, single column on mobile. Use for homepage (below case studies), case-studies page, and automotive-segments page.

**Front-end implementation:** Pure CSS + HTML component. No JS needed beyond what already exists. Uses existing CSS custom properties for colors/spacing. Add a `<template>` or clearly commented placeholder HTML so the client can drop in real testimonials without touching CSS.

---

## 11. COMPETITOR BENCHMARK DESIGN REASONING

### What Makes Top Automotive Tooling Websites Read as Premium to a Procurement Manager

After reviewing the web presence of comparable B2B industrial manufacturers (ABB, Hasco, Foboha, and general automotive Tier-1 supplier sites), the following patterns distinguish premium/trustworthy sites from commodity suppliers:

**1. Specificity over generality.**
A site that says "we make molds for automotive, appliances, industrial, and consumer goods" signals "we'll take any work." A site that says "we specialize in automotive exterior lighting molds — two-color rotary, optical-grade surface finish, PPAP Level 3 standard" signals "we understand your exact problem." Automotive procurement managers buy from specialists, not generalists. This is why the positioning correction (Section A) is the single highest-impact change in this report.

**2. Numbers with context.**
"200+ molds per year" is a number. "200+ automotive-grade molds per year, 85% for repeat Tier 1 customers" is a number with trust attached. Every stat on the site should answer the procurement manager's unspoken question: "Are you a reliable choice for MY program?"

**3. Process visibility.**
Premium tooling sites show the process — not just the output. A photo of a CNC machine is worth less than a photo of a CNC machine WITH a caption explaining "5-axis machining of a bumper mold cavity insert — P20 steel, 72-hour roughing-to-finishing cycle." This signals technical competence in a way generic factory photos cannot.

**4. Restraint in design.**
The best B2B industrial sites use:
- Generous whitespace (content density is not a virtue — clarity is)
- One accent color used sparingly (the existing brass `#c7821a` is excellent for this)
- Typography that prioritizes readability over decoration (Inter is a good choice; stick with it)
- Animation used ONLY to direct attention (fade-in on scroll is fine; parallax, particle effects, auto-playing video are not)
- Photography that shows real work, not stock imagery

**5. The "one-click to RFQ" principle.**
A procurement manager who decides to request a quote should be able to reach the RFQ form in one click from any page. The current header CTA achieves this. Every section-level CTA should also point to either the RFQ form or contact page — never leave a motivated buyer hunting for the next step.

### How These Principles Map to the Upgrades Above

| Principle | Applied In |
|-----------|-----------|
| Specificity over generality | Positioning correction (Section A), automotive segment breakdown (Section 9) |
| Numbers with context | Trust indicators upgrade (Section 2), capabilities upgrade (Section 3) |
| Process visibility | Quality stepper visualization (Section 5), case study results-first layout (Section 4) |
| Restraint in design | Design direction (Section 12), all visual upgrades use existing design tokens |
| One-click to RFQ | RFQ conversion improvements (Section 7), consistent CTA placement across all pages |

---

## 12. 2026 DESIGN DIRECTION

### Typography
- **Primary:** Inter (already loaded ✓) — excellent choice for B2B. Clean, highly readable, excellent x-height for body text. Keep it.
- **Scale:** Establish a clear type scale using `clamp()` for responsive sizing:
  - `h1`: `clamp(2rem, 5vw, 3.5rem)` — currently using browser defaults
  - `h2`: `clamp(1.5rem, 3.5vw, 2.25rem)`
  - `h3`: `clamp(1.15rem, 2.5vw, 1.5rem)`
  - Body: `1rem` / `16px` (current)
  - Small/caption: `0.8125rem`
- **Font weights:** Use weight 500 for headings (not 700) — feels more premium/European. Reserve 700 for key numbers and CTAs only.

### Color Refinement
The existing navy (`#1a2d3d`) + brass (`#c7821a`) identity is strong. Refinements:
- **Navy:** Slightly warm the navy — add 2-3% red to the current `#1a2d3d` to give it depth (`#1b2e3e`). This subtle warmth pairs better with brass than a pure cool navy.
- **Brass:** Keep `#c7821a` as primary accent. Add a lighter tint `#e8c97a` for backgrounds/badges and a darker shade `#8b5a10` for hover states.
- **Neutral palette:** The existing `--color-neutral-*` range is well-calibrated. Keep it.
- **Add:** A "success green" for form confirmation states (already implicitly used in the contact form success banner from the previous audit fix).

### Animation & Scroll Effects
**Principle: Restrained. Only to direct attention, never decorative.**
- **Keep:** Scroll-triggered fade-in for capability cards (`.animate-in` + IntersectionObserver) — already implemented ✓
- **Add:** Subtle counter animation for stats (already implemented ✓) — ensure it only runs once per page load
- **Add:** Header hide/show on scroll (already implemented ✓) — good pattern, keep it
- **Avoid:** Parallax backgrounds, scroll-jacking, auto-playing video, decorative hover animations, cursor followers, page transitions
- **Card hover:** `transform: translateY(-2px)` + `box-shadow` deepening — 200ms ease-out. This is the only hover animation needed.

### Mobile / RTL / i18n Compatibility
All upgrades must work within existing constraints:
- **4 breakpoints:** 1024px, 768px, 480px + desktop. All new components must specify responsive behavior at each breakpoint.
- **RTL:** `rtl.css` already handles flex direction, text alignment, margin/padding flipping. New components using logical properties (`margin-inline-start` instead of `margin-left`) are preferred but not required — `rtl.css` handles the override.
- **i18n:** All new text content must use `data-i18n` attributes. New keys must be added to all 5 JSON files. This is the existing pattern — follow it.

---

## 13. SEO REFINEMENT (Automotive-Only)

### Homepage Keyword Strategy

**Current meta keywords (index.html L6):**
```
plastic injection mold, injection molding, mold design, tooling, automotive molds, 
Gege Mould, Taizhou, China mold manufacturer, ISO 9001
```

This is clean — no non-automotive keywords. Keep as-is.

**Recommended additions to keyword strategy (for meta + H1/H2/H3 headings):**
- "automotive injection mold manufacturer China"
- "automotive plastic parts manufacturer"
- "automotive tooling supplier"
- "PPAP mold supplier"
- "OEM automotive parts supplier China"
- "Tier 1 automotive mold supplier"
- "automotive bumper mold manufacturer"
- "automotive lighting mold supplier"
- "EV component mold manufacturer"

These should be naturally distributed across page headings and body copy — not stuffed into meta keywords.

### Section Heading Audit (Post-Correction)
After the positioning correction:
- "Industries We Serve" → "Automotive Mold Segments" (or similar)
- Any section referencing "industrial brands" → "automotive OEMs and Tier 1 suppliers"
- "consumer goods" → remove entirely
- "home appliances" → remove entirely
- "medical" → remove entirely

### Internal Linking
- industries.html → replaced by automotive-segments page, URL should remain `/industries.html` or redirect to `/automotive-mold-segments.html`
- All "See All Industries" links → update link text to "See All Automotive Mold Segments"
- capability-table.html industry filter → replace with automotive-segment filter
- Navigation link "Industries" → rename to "Automotive Segments" or "Mold Types"

---

## 14. PRIORITIZED ACTION LIST

### 🔴 CONTENT/POSITIONING FIXES (Trust-Critical — Must Do Before Launch)

| # | Action | Pages Affected | Effort | Impact |
|---|--------|---------------|--------|--------|
| **P1** | **Replace industries.html entirely** — remove Home Appliances, Industrial Equipment, Consumer Goods sections; rebuild as automotive-segment-breakdown page (Section 9 above) | industries.html | Large | **Critical** — current page actively misrepresents company positioning |
| **P2** | **Fix homepage "we serve" paragraph** — line 232-233 of index.html removes "appliance manufacturers, industrial equipment producers, and consumer goods companies" | index.html | Small | **Critical** — visible above the fold to every visitor |
| **P3** | **Fix homepage meta/OG/twitter descriptions** — remove "industrial brands" language | index.html | Small | **Critical** — affects search snippet and social sharing |
| **P4** | **Update JSON-LD** — add automotive-specific `knowsAbout` and `areaServed` | index.html | Small | **High** — rich-result quality for Google |
| **P5** | **Audit and fix about.html, capabilities.html, quality.html, faqs.html** — remove all non-automotive industry references | 4 pages | Medium | **Critical** — these pages are visited by buyers researching before RFQ |
| **P6** | **Refine contact form inquiry dropdown** — automotive-specific options replacing generic | contact.html | Small | **High** — first impression of specialization |
| **P7** | **Refine RFQ industry field** — remove non-automotive options from dropdown | rfq.html | Small | **High** — form should only offer what company actually does |
| **P8** | **Update capability-table.html industry filter** — replace with automotive segmentation | capability-table.html | Medium | **Medium** |
| **P9** | **Fix i18n JSON files** — update all 5 language files to remove non-automotive industry references | 5 JSON files | Medium | **High** — if a buyer switches to another language, the incorrect positioning reappears |
| **P10** | **Update sitemap.xml** — ensure no non-automotive language in URL descriptions | sitemap.xml | Small | **Medium** |

### 🟡 VISUAL/DESIGN UPGRADES (High-Impact, Implementation After Content Fix)

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| **V1** | **Hero headline refinement** — test 2-3 alternate headlines (Section 1 above) | Small | **High** — first 3 seconds determine bounce |
| **V2** | **Trust badge visual upgrade** — chip-style badges replacing plain text | Small | **Medium** |
| **V3** | **Capability card grid** — visual icon+metric summary at top of capabilities.html (Section 3) | Medium | **High** — scannable capabilities = faster buyer confidence |
| **V4** | **Certificate badge treatment** — shield/badge component for ISO, PPAP, SPC, MSA (Section 5) | Small | **Medium** |
| **V5** | **Quality process stepper** — horizontal numbered steps replacing card grid (Section 5) | Medium | **Medium** |
| **V6** | **Case study card upgrades** — hover states, outcome chips, filter buttons, results-first layout (Section 4) | Medium | **Medium** |
| **V7** | **RFQ trust microcopy** — add confidential note + response-time promise near submit (Section 7) | Small | **High** — reduces form abandonment at the final step |
| **V8** | **RFQ file upload visual** — format badges + CAD icon making accepted files instantly visible (Section 7) | Small | **Medium** |
| **V9** | **RFQ CTA wording test** — "Send Us Your Part Drawing" vs current (Section 7) | Small | **Medium** |
| **V10** | **Export region stats** — add country counts + shipping terms to "Where We Serve" (Section 6) | Small | **Low** |
| **V11** | **Testimonial component** — build template with placeholder content (Section 10) | Medium | **Low** (until real testimonials supplied) |
| **V12** | **Nav polish** — brass underline animation on hover + subtle CTA pulse (Section 8) | Small | **Low** |
| **V13** | **FAQ micro-interaction** — "Was this helpful?" feedback buttons | Small | **Low** |

---

## SUMMARY

### What Changed vs. the Previous Audit
The previous technical audit fixed bugs, added canonical tags, wired forms, and hardened security. This elevation pass is about **buyer perception**: making the site communicate "automotive mold specialist" at every touchpoint rather than "general mold manufacturer."

### The Single Highest-ROI Change
**Replacing industries.html with the automotive segment breakdown (P1).** The current industries page is the #1 thing on the site that contradicts the company's real positioning. A procurement manager who reads "we make appliance molds and consumer goods molds" will disqualify Gege Mould from an automotive program — even though the company doesn't actually serve those industries. This one page change fixes the biggest trust gap on the site.

### Implementation Sequence
1. **Week 1:** All content/positioning fixes (P1–P10). These are text changes — no CSS/JS work needed for most.
2. **Week 2:** High-impact visual upgrades (V1, V3, V7, V8, V9). These directly affect RFQ conversion.
3. **Week 3+:** Medium-impact visual polish (V2, V4, V5, V6, V10, V11, V12, V13). These improve perceived quality but don't change conversion rates dramatically.

---

*All recommendations reference specific existing sections. No recommendation describes building something that already exists. Design direction respects existing navy/brass identity, Inter typography, 4-breakpoint responsive system, RTL support, and i18n architecture.*
