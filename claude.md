# Doohickey's Dev Tools - WordPress Plugin

**Essential utilities for web developers—right in your WordPress dashboard.**

A WordPress plugin that brings CSS generators, QR codes, schema markup, color tools, and more directly into the WordPress admin. Built by Mosaic Life Creative.

## Project Overview

- **Plugin Name:** Doohickey's Dev Tools
- **Slug:** doohickeys-dev-tools (pending WordPress.org confirmation)
- **Text Domain:** doohickeys-dev-tools
- **Version:** 1.0.2
- **Author:** Mosaic Life Creative
- **License:** GPL-3.0-or-later
- **Target Users:** WordPress developers, designers, agencies

## Technical Architecture

### Technology Stack

**Backend:**
- PHP 7.4+ (WordPress minimum)
- WordPress Plugin API (hooks, filters, admin pages)

**Frontend:**
- React 18+ via @wordpress/element
- @wordpress/scripts (Webpack build tooling)
- chroma-js (color manipulation)
- qrcode.react (QR generation)

**Distribution:**
- WordPress.org plugin repository (free version)
- Freemius SDK for Pro licensing, payments, updates (ID: 24360)

### Plugin Structure

```
mlc-web-dev-tools/
├── mlc-web-dev-tools.php          # Main plugin file + Freemius init
├── readme.txt                      # WordPress.org readme
├── package.json
├── includes/
│   ├── class-plugin.php           # Main plugin class
│   └── class-admin.php            # Admin menu, asset enqueuing
├── admin/
│   ├── js/
│   │   ├── index.jsx              # React entry point (ProProvider wrapper)
│   │   ├── App.jsx                # Main app with hash routing
│   │   ├── components/
│   │   │   ├── Header.jsx         # Plugin header
│   │   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   │   ├── ToolCard.jsx       # Standard tool layout wrapper
│   │   │   ├── CodeBlock.jsx      # Code display with syntax
│   │   │   └── CopyButton.jsx     # One-click copy
│   │   ├── context/
│   │   │   └── ProContext.jsx     # Pro status context (always false in free)
│   │   └── tools/                 # 26 tool components
│   └── css/
│       └── admin.css              # All admin styles
├── build/                          # Compiled output (@wordpress/scripts)
│   ├── index.js
│   ├── index.css
│   └── index.asset.php
├── images/                         # WordPress.org assets
│   ├── banner-1544x500.png
│   ├── banner-772x250.png
│   ├── icon-128x128.png
│   ├── icon-256x256.png
│   └── screenshot-1 through 8.png
└── vendor/
    └── freemius/                   # Freemius SDK
```

### Key Patterns

- **ToolCard pattern:** Every tool uses `<ToolCard title="" help="" preview={} />` with controls and output sections
- **ProContext:** Provides `{ isPro }` (always false in WP.org version). Pro-only tools show upgrade placeholders. Hybrid tools show inline upgrade notes.
- **Hash routing:** `#gradient`, `#box-shadow`, etc. in App.jsx
- **CSS namespacing:** Classes prefixed `mlc-wdt-`, CSS custom properties `--mlc-*`
- **Asset loading:** Scripts/styles only load on the plugin's admin page via hook_suffix check
- **Localized data:** `window.mlcWdtData` provides pluginUrl, nonce, version, upgradeUrl

### Freemius Configuration (Free/WP.org version)

- `is_premium: false`
- `is_org_compliant: true`
- `premium_slug: doohickeys-dev-tools-premium`
- No `wp_org_gatekeeper` (removed for WP.org compliance)
- Upgrade URL built from `mlc_wdt_fs()->get_upgrade_url()`

## Tools (v1.0.2)

### Free Tools (21)

| Category | Tool |
|----------|------|
| CSS | Gradient Generator, Box Shadow Generator, Border Generator, Border Radius Generator, Clip-Path Maker, Flexbox Generator, Grid Generator |
| Color | Color Picker, Contrast Checker, Color Converter |
| Code | String Utilities, Encoder/Decoder |
| Generators | QR Code Generator, Placeholder Image, Lorem Ipsum |
| SEO & Meta | Schema.org Generator (Article, LocalBusiness, FAQ), Meta Tag Generator |
| Converters | SVG to PNG, HTML to Markdown, Markdown Preview, Aspect Ratio Calculator |

### Pro Tools (5) — Upgrade placeholders in free version

- Palette Generator
- Code Formatter
- Diff Checker
- HTML Table Generator
- Test Data Generator

### Hybrid Tools — Pro features stripped from free version

- **Flexbox Generator** — Pro adds per-item controls
- **Grid Generator** — Pro adds templates, custom definitions, per-cell spans
- **Schema.org Generator** — Pro adds Product, Person, Organization, Event, Recipe types
- **QR Code Generator** — Pro adds custom logo overlay
- **Placeholder Image** — Pro adds social presets, Data URI export

## WordPress.org Review Status

**Submitted:** February 2026
**Status:** Under review (v1.0.2 uploaded, email reply sent)
**Requested slug:** doohickeys-dev-tools

### Issues from initial review (all resolved in v1.0.2):
1. Plugin name too generic ("Web Dev Tools") — renamed to "Doohickey's Dev Tools"
2. Trialware/locked features — Pro code removed, replaced with upgrade placeholders
3. Freemius misconfigured — fixed `is_premium`, added `is_org_compliant`
4. Plugin URI 404 — removed Plugin URI (Author URI kept as mosaiclifecreative.com)

## Build & Deploy

```bash
# Development
npm start

# Production build
npm run build

# Zip for distribution (exclude: node_modules, src, .git, .md files, .zip files, dev configs)
# Use PowerShell script or manual zip
```

## Revenue Model

- **Free:** WordPress.org distribution, full 21-tool suite
- **Pro:** Available via Freemius upgrade, adds 5 tools + advanced features in 5 hybrid tools
