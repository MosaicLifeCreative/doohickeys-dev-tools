# Web Dev Tools - Full Roadmap

## Status Legend
- Done = shipped and working
- In Progress = actively being built
- Planned = next up
- Backlog = future consideration

---

## Phase 1: Foundation & CSS Generators (DONE)

| Tool | Status | Notes |
|------|--------|-------|
| Plugin foundation (PHP, React shell, sidebar nav) | Done | |
| CSS Gradient Generator | Done | Linear/radial, presets, color stops |
| Box Shadow Generator | Done | Multi-layer, inset, opacity |
| QR Code Generator | Done | PNG/SVG download, FG/BG color |
| Custom ColorPicker component | Done | HSV popover, replaces native pickers |
| Pro feature gating system | Done | ProContext, ProBadge, WP_DEBUG toggle |
| QR Code logo upload (Pro) | Done | Center logo with size control |
| CSS Border Generator | Done | Per-side width/style/color, linked mode |
| Border Radius Generator | Done | Per-corner, presets (pill/leaf/drop), px/% |

---

## Phase 2: CSS Layout & Advanced Generators (Planned)

| Tool | Status | Free/Pro | Notes |
|------|--------|----------|-------|
| Flexbox Generator | Planned | Free | Visual flexbox layout builder |
| CSS Grid Generator | Planned | Free | Grid template builder with drag |
| HTML Table Generator | Planned | Free | Build & style HTML tables |
| Clip-Path Maker | Planned | Free | Polygon, circle, ellipse, inset paths |
| SVG to PNG Converter | Planned | Free | Upload SVG, export as PNG at any size |

---

## Phase 3: Color Tools (Planned)

| Tool | Status | Free/Pro | Notes |
|------|--------|----------|-------|
| Color Converter | Planned | Free | HEX/RGB/HSL/CMYK conversion |
| Contrast Checker | Planned | Free | WCAG AA/AAA compliance |
| Palette Generator (Color Wheel) | Planned | Free (basic) / Pro (advanced) | Canva-style wheel with harmonies: complementary, monochromatic, analogous, triadic, tetradic |
| Color Picker / Color Info | Planned | Free | Color meaning, variations, accessibility info |
| Image Picker (extract palette) | Planned | Pro | Upload image, extract color palette |
| Palette Visualizer | Planned | Pro | Preview colors on real UI mockups |

---

## Phase 4: Schema & Utility Tools (Planned)

| Tool | Status | Free/Pro | Notes |
|------|--------|----------|-------|
| Schema.org Generator | Planned | Free | JSON-LD structured data |

---

## Phase 5: Advanced & Niche (Backlog)

| Tool | Status | Free/Pro | Notes |
|------|--------|----------|-------|
| SVG Recolor | Backlog | Pro | Upload SVG, change colors |
| CSS Animation Generator | Backlog | Pro | Keyframe animation builder |
| Shape Divider | Backlog | Free | SVG section dividers |
| Neumorphism/Soft UI Shadow | Backlog | Free | Soft shadow generator |

---

## Pro Feature Summary

**Free (core plugin):**
- All CSS generators (gradient, shadow, border, radius, flexbox, grid, clip-path)
- QR code generator (basic)
- Color converter, contrast checker
- Palette generator (basic harmonies)
- SVG to PNG converter
- Schema generator
- HTML table generator

**Pro ($39/year):**
- QR code center logo
- Image palette extraction
- Palette visualizer
- Advanced color wheel harmonies & export
- SVG recolor
- CSS animation generator
- Priority support

---

## Architecture Notes

- All tools use ToolCard component pattern
- Reusable: ToolCard, CodeBlock, CopyButton, ColorPicker
- ProContext + ProBadge for feature gating
- Hash-based routing for tool switching
- CSS custom properties namespaced `--mlc-*`
- Build: @wordpress/scripts (webpack)
