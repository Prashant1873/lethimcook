# Frontend Implementation Plan: LunaTick

## Target Mode: Experience & Discreet Data Collection
## Design Read: "Minimalist, intimate blind-survey for friends and respondents with subtle tactile card interactions, warm neutral aesthetic, and zero cognitive friction."
## Active Dials: Variance: 4 | Motion: 5 | Density: 4

### Chunk 1: Secret Lunar Engine & Data Protocol
- [x] Accurate mathematical calculation for Moon Phase & Illumination % (zero network dependencies, offline-ready).
- [x] Google Apps Script backend code (`google-apps-script.js`) ready to copy-paste into Google Sheets.
- [x] Data payload schema: `Date & Time`, `Moon Phase`, `Illumination %`, `Name`, `Mood`.

### Chunk 2: Layout & Aesthetics (frontend-skill & Anti-Slop)
- [x] Trust-inspiring, clean typography with modern system fonts (Inter / SF Pro stack).
- [x] Distraction-free header: *"This is a test. Please trust me and answer."*
- [x] Smooth input field for Respondent Name.
- [x] Grid of casual, relatable mood cards (e.g. *On a roll today*, *Mood off*, *Cruising / Chill*, *Chaos mode*, *Exhausted*, *Ready to snap*).

### Chunk 3: Interactions, Physics & Apple HIG Micro-interactions
- [x] Tactile card selection: spring physics, subtle border glow, checkmark badge, keyboard navigation (Space/Enter).
- [x] Fluid state transitions: Form -> Loading spinner -> Subtle confirmation screen ("Recorded. Thank you.").
- [x] Dispatched payload via `fetch` to Google Apps Script Web App with CORS fallback handling.

### Chunk 4: Administration & Setup Comfort
- [x] Easy URL configuration: built-in discreet settings drawer (or gear icon) to set and test the Google Apps Script Web App URL without editing HTML files.
- [x] Clear setup documentation (`GOOGLE_SHEETS_SETUP.md`) with 4-step instructions.

