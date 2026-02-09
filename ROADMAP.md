# Web Dev Tools - Full Roadmap

## Status Legend
- Done = shipped and working
- In Progress = actively being built
- Planned = next up
- Backlog = future consideration

---

## Phase 1: Foundation & Core Tools (DONE)

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
| Contrast Checker | Done | WCAG 2.1 AA/AAA, normal/large text, UI components |
| Color Converter | Done | HEX/RGB/HSL/HWB/CMYK, paste any format |
| Placeholder Image Generator | Done | Presets, custom dims, PNG/SVG/data URI |

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
| Palette Generator (Color Wheel) | Planned | Free (basic) / Pro (advanced) | Canva-style wheel with harmonies: complementary, monochromatic, analogous, triadic, tetradic |
| Color Picker / Color Info | Planned | Free | Color meaning, variations, accessibility info |
| Image Picker (extract palette) | Planned | Pro | Upload image, extract color palette |
| Palette Visualizer | Planned | Pro | Preview colors on real UI mockups |

---

## Phase 4: Code Tools (from smalldev.tools) (Planned)

| Tool | Status | Free/Pro | Notes |
|------|--------|----------|-------|
| Code Formatter | Planned | Free | JSON, HTML, CSS, JS, SQL beautify (single tool, language dropdown) |
| Encoder/Decoder | Planned | Free | Base64, URL, UTF8, HTML entities (single tool, mode tabs) |
| Diff Checker | Planned | Free | Side-by-side text/code comparison |
| String Utilities | Planned | Free | Case convert, trim, find/replace, char count |
| Lorem Ipsum Generator | Planned | Free | Paragraphs, sentences, words |
| JSON Decoder | Planned | Free | JSON string to formatted object view |
| HTML to Markdown | Planned | Free | Paste HTML, get Markdown output |
| Markdown Preview | Planned | Free | Live Markdown editor with preview |
| Test Data Generator | Planned | Free | Fake names, emails, addresses, phone numbers |

---

## Phase 5: SEO & Meta Tools (Planned)

| Tool | Status | Free/Pro | Notes |
|------|--------|----------|-------|
| Meta Tag Generator | Planned | Free | OG, Twitter Card, basic SEO meta tags with live preview (Google, Facebook, X, LinkedIn) |
| Schema.org Generator | Planned | Free | JSON-LD structured data |

---

## Phase 6: Advanced & Niche (Backlog)

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
- Color converter, contrast checker, palette generator (basic)
- Placeholder image generator
- All code tools (formatter, encoder, diff, string utils, lorem ipsum)
- SEO meta tag generator, schema generator
- SVG to PNG converter
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
- Sidebar categories: CSS Tools, Color, Generators, Schema (expanding as tools are built)
