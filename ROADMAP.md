# Doohickey's Dev Tools - Roadmap

## Status Legend
- Done = shipped and working
- In Progress = actively being built
- Planned = next up
- Backlog = future consideration

---

## v1.0.2 — Current Release (26 Tools)

| Category | Tool | Free/Pro | Status |
|----------|------|----------|--------|
| CSS | Gradient Generator | Free | Done |
| CSS | Box Shadow Generator | Free | Done |
| CSS | Border Generator | Free | Done |
| CSS | Border Radius Generator | Free | Done |
| CSS | Clip-Path Maker | Free | Done |
| CSS | Flexbox Generator | Free (Pro per-item) | Done |
| CSS | Grid Generator | Free (Pro templates/cells) | Done |
| Color | Color Picker | Free | Done |
| Color | Contrast Checker | Free | Done |
| Color | Color Converter | Free | Done |
| Color | Palette Generator | Pro | Done |
| Code | Code Formatter | Pro | Done |
| Code | String Utilities | Free | Done |
| Code | Diff Checker | Pro | Done |
| Code | Encoder/Decoder | Free | Done |
| Generators | QR Code Generator | Free (Pro logo) | Done |
| Generators | Placeholder Image | Free (Pro presets/URI) | Done |
| Generators | Lorem Ipsum | Free | Done |
| Generators | HTML Table Generator | Pro | Done |
| Generators | Test Data Generator | Pro | Done |
| SEO & Meta | Schema.org Generator | Free (Pro extra types) | Done |
| SEO & Meta | Meta Tag Generator | Free | Done |
| Converters | SVG to PNG | Free | Done |
| Converters | HTML to Markdown | Free | Done |
| Converters | Markdown Preview | Free | Done |
| Converters | Aspect Ratio Calculator | Free | Done |

---

## v2.0 — Quick Wins (Easy to Build, High Use)

| Tool | Category | Free/Pro | Notes |
|------|----------|----------|-------|
| CSS Text Shadow Generator | CSS | Free | Same pattern as Box Shadow, just for text |
| CSS Filter Generator | CSS | Free | Blur, brightness, contrast, grayscale, sepia, hue-rotate — slider-based, live preview |
| CSS Transform Generator | CSS | Free | Rotate, scale, skew, translate (2D/3D) with visual before/after |
| Units Converter | Converters | Free | px ↔ rem ↔ em ↔ % with configurable base font size |

---

## v2.x — Medium Effort, High Value

| Tool | Category | Free/Pro | Notes |
|------|----------|----------|-------|
| Fluid Typography Calculator | CSS | Free | Generate CSS clamp() for responsive font sizes |
| Regex Tester | Code | Free | Input pattern + test string, highlight matches, show capture groups |
| Timestamp Converter | Converters | Free | Unix ↔ human readable, timezone support, "now" button |
| Favicon Generator | Generators | Pro | Upload image → generate all sizes (16, 32, 180, 192, 512) + HTML link tags |

---

## v3.0 — WordPress-Specific Tools

| Tool | Category | Free/Pro | Notes |
|------|----------|----------|-------|
| Shortcode Builder | WordPress | Free | Define attributes, generate PHP scaffold |
| Custom Post Type Generator | WordPress | Free | Labels, capabilities, supports → register_post_type() code |
| wp_enqueue Helper | WordPress | Free | Generate enqueue code for scripts/styles with deps, versions, conditional loading |
| .htaccess Snippets | WordPress | Free | Common redirects, security headers, caching rules — pick and copy |

---

## Pro Tier Candidates (Backlog)

| Tool | Category | Notes |
|------|----------|-------|
| Glassmorphism Generator | CSS | Frosted glass effect (backdrop-filter + transparency) |
| Neumorphism Generator | CSS | Soft UI shadows — polarizing but high search volume |
| Animation Keyframe Builder | CSS | Visual timeline for CSS animations — complex but high value |
| Image to Base64 | Converters | Upload image → get data URI |
| srcset Generator | Generators | Input breakpoints + URLs → responsive image markup |
| Image Palette Extraction | Color | Upload image, extract color palette |
| Palette Visualizer | Color | Preview colors on real UI mockups |
| SVG Recolor | Color | Upload SVG, change colors |

---

## Release History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-02-12 | Initial release — 26 tools, Freemius integration |
| 1.0.1 | 2026-02-13 | Rename to "by Mosaic Life Creative", default gradient fix, tested up to 6.9 |
| 1.0.2 | 2026-02-22 | Renamed to "Doohickey's Dev Tools", new slug doohickeys-dev-tools, WordPress.org compliance (removed Pro code from free version, fixed Freemius config, removed Plugin URI), updated banners/screenshots |

---

## Architecture Notes

- All tools use ToolCard component pattern (title, help, preview, controls, output)
- Reusable components: ToolCard, CodeBlock, CopyButton, ColorPicker
- ProContext provides `{ isPro }` — always false in WP.org version
- Pro-only tools show upgrade placeholder cards
- Hybrid tools show inline upgrade notes for Pro features
- Hash-based routing for tool switching
- CSS custom properties namespaced `--mlc-*`
- Build: @wordpress/scripts (webpack)
- Entry: admin/js/index.jsx → build/index.js
- Freemius SDK for licensing, payments, updates
- Sidebar categories: CSS Tools, Color, Code Tools, Generators, SEO & Meta, Converters
