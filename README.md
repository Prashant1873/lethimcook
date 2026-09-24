# LunaTick 🌒

> A blind psychological check-in tracker designed to correlate respondent mood with current lunar phases without introducing observer or placebo bias.

## Overview
Respondents are presented with a simple, distraction-free prompt:
> *"This is a test. Please trust me and answer."*

The frontend captures:
1. Respondent Name / Nickname
2. Current Mood (via relatable, casual card options like *On a roll today*, *Mood off*, *Cruising / Chill*, *Low battery*, *Chaos mode*)

Silently in the background, a client-side astronomical engine calculates:
- Exact Moon Phase (e.g. *Waxing Gibbous*, *Full Moon*, *New Moon*)
- Illumination percentage (0% - 100%)
- Moon age in synodic days

Data is dispatched directly into a connected Google Sheet.

## Quick Setup
1. Open [`GOOGLE_SHEETS_SETUP.md`](./GOOGLE_SHEETS_SETUP.md) for instructions on creating and deploying the Google Apps Script.
2. Open `index.html` in your browser (or use GitHub Pages).
3. Click the discreet gear icon at the bottom right (or press `Ctrl + Shift + S`) to customize the Web App URL if needed.
4. Share the URL with respondents!

## 🚀 Live Hosting via GitHub Pages
A GitHub Actions workflow is included in `.github/workflows/deploy.yml`. To enable your live public link:
1. In this GitHub repo, go to **Settings** > **Pages** (under the "Code and automation" section).
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Every push to `main` will now automatically build and publish the live site at:
   `https://prashant1873.github.io/lethimcook/`

## Files
- `index.html` - Core survey interface
- `style.css` - Responsive modern styles with tactile feedback
- `app.js` - Secret astronomical calculator & submission handler
- `google-apps-script.js` - Backend script for Google Sheets
- `GOOGLE_SHEETS_SETUP.md` - Setup guide
- `great_ideas.md` - Product context & ideas
- `neural_map.md` - Logic and data flow diagram
