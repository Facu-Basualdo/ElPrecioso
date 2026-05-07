# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static landing page / product showcase for "El Precioso," an Argentine artisanal business selling patriotic rosettes (escarapelas) for national holidays. Built with zero dependencies: vanilla HTML5, CSS3, and JavaScript in a single `index.html` file.

## Running Locally

No build step or install required. Open `index.html` directly in a browser, or serve it with any static server:

```bash
npx serve .
# or
python -m http.server 8000
```

## Deploying

The site is designed for Vercel static hosting. Push to GitHub and connect the repo, or deploy manually:

```bash
npm install -g vercel
vercel
```

## Architecture

Everything lives in `index.html` — HTML structure, `<style>` block, and `<script>` block are all inline in one file. There are no external JS/CSS files to import.

**Asset layout:**
- `public/catalogo/` — Product images (`escarapela-01.jpg` … `escarapela-12.jpg`)
- `public/hero.*` — Hero video in both `.webm` (primary) and `.mp4` (fallback)
- `public/logo.png` — Brand logo

**Page sections (top to bottom):**
1. Fixed nav — becomes frosted/opaque on scroll > 40px
2. Hero — video background with custom reverse-playback loop (ping-pong via frame stepping)
3. Destacados — auto-scrolling marquee; uses the first 8 catalog images (array index 0–7 in `products` JS array)
4. Catálogo — 12-product grid; clicking any card opens the shared lightbox
5. Sobre Nosotros — static about section
6. Testimonials — auto-rotating carousel
7. CTA — WhatsApp button
8. Footer

**Key JavaScript patterns:**
- `products` array (top of `<script>`) is the single source of truth for product data; both the marquee and catalog grid are rendered from it.
- IntersectionObserver is used for scroll-reveal animations (`.reveal` class) and for pausing the hero video when off-screen.
- 3D tilt on catalog cards is disabled automatically when `prefers-reduced-motion` is set or on touch devices.
- The lightbox is shared across marquee and catalog; it stores a `currentImages` array and `currentIndex` integer and supports ESC / arrow-key navigation.

**CSS design tokens (defined as CSS variables in `:root`):**

| Variable | Value | Use |
|---|---|---|
| `--night` | `#0E1B2C` | Dark background |
| `--sky` | `#74ACDF` | Argentine sky blue (accents) |
| `--gold` | `#FCBF49` | CTA, highlights |
| `--ivory` | `#F7F5F0` | Light background |
| `--mist` | `#9CA3AF` | Muted text |

## Updating the Catalog

To add or replace products, edit the `products` array near the top of the `<script>` block in `index.html`. Each entry is:

```js
{ src: "public/catalogo/escarapela-XX.jpg", alt: "Description", badge: "Optional badge text" }
```

The marquee automatically uses the first 8 entries; the grid renders all entries.
