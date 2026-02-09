# Web Dev Tools - WordPress Plugin

**Essential utilities for web developers—right in your WordPress dashboard.**

Stop juggling browser tabs. Web Dev Tools brings CSS generators, QR codes, schema markup, color tools, and more directly into your WordPress admin. Built by agency developers who got tired of bookmarking 20 different generator websites.

## Project Overview

### The Problem
Web developers constantly context-switch between WordPress admin and external generator websites for:
- CSS gradients and box shadows
- QR codes for clients
- Schema.org markup
- Color conversions and contrast checking
- And many other repetitive tasks

This breaks flow, clutters bookmarks, and wastes time.

### The Solution
**Web Dev Tools** - A WordPress plugin that brings essential developer utilities INTO the WordPress admin interface. One plugin, zero browser tabs, instant access to tools you use daily.

### Market Position
- **Target Users:** WordPress developers, designers, agencies
- **Differentiation:** First comprehensive utility toolbox plugin with CSS generators in WordPress admin
- **Competition:** Individual QR/Schema plugins exist, but no bundled utility toolbox
- **Unique Value:** Workflow integration + multiple tools in one place

## Product Strategy

### Free Version (Core Tools)
1. **CSS Gradient Generator** - Visual gradient builder with live preview
2. **Box Shadow Generator** - Multi-shadow CSS generator
3. **Color Converter** - HEX/RGB/HSL conversion
4. **Color Contrast Checker** - WCAG compliance testing
5. **Color Palette Generator** - Harmony-based palette creation
6. **QR Code Generator** - Customizable QR codes with PNG/SVG export
7. **Schema.org Generator** - Basic types (LocalBusiness, Organization, Article)

### Pro Version ($39/year)
- **CSS Animation Builder** - Keyframe generator with timeline
- **Flexbox/Grid Playground** - Visual layout builder
- **Advanced Schema Types** - 50+ additional schema types
- **Custom Snippet Library** - Save and reuse personal snippets
- **Bulk Operations** - Batch processing tools
- **Remove MLC Branding** - White-label option
- **Priority Support** - Email support with 24hr response

### Revenue Model
- **Free:** WordPress.org distribution, AdSense on settings page (subtle)
- **Pro:** $39/year subscription via Freemius or similar
- **Target:** 1,000 installs = ~30 Pro conversions = $1,170/year
- **Goal:** 10,000 installs = ~300 Pro = $11,700/year

## Technical Architecture

### Technology Stack

**Backend:**
- PHP 7.4+ (WordPress minimum)
- WordPress Plugin API (hooks, filters, admin pages)
- WordPress REST API (for AJAX operations if needed)

**Frontend:**
- React 18+ (for interactive UI)
- WordPress @wordpress/scripts (build tooling)
- CSS Modules or Tailwind (styling approach TBD)
- QRCode.js (QR generation)
- Color.js or Chroma.js (color manipulation)

**Build Tools:**
- @wordpress/scripts (Webpack, Babel, ESLint preconfigured)
- npm/yarn for package management
- Git for version control

**Hosting/Distribution:**
- WordPress.org plugin repository (free version)
- Self-hosted Pro licensing server (or Freemius SDK)

### Plugin Structure

```
mlc-web-dev-tools/
├── mlc-web-dev-tools.php          # Main plugin file
├── readme.txt                      # WordPress.org readme
├── LICENSE                         # GPL-3.0
├── package.json                    # Node dependencies
├── webpack.config.js               # Build configuration
│
├── includes/                       # PHP backend
│   ├── class-plugin.php           # Main plugin class
│   ├── class-admin.php            # Admin interface
│   ├── class-assets.php           # Asset enqueueing
│   ├── class-rest-api.php         # REST endpoints (if needed)
│   └── tools/                     # Tool-specific PHP
│       ├── class-qr-generator.php
│       └── class-schema-generator.php
│
├── admin/                          # Admin interface
│   ├── js/
│   │   ├── index.jsx              # React entry point
│   │   ├── App.jsx                # Main app component
│   │   ├── components/            # React components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ToolCard.jsx
│   │   │   ├── CodeBlock.jsx
│   │   │   └── CopyButton.jsx
│   │   └── tools/                 # Tool components
│   │       ├── GradientGenerator.jsx
│   │       ├── BoxShadowGenerator.jsx
│   │       ├── ColorConverter.jsx
│   │       ├── ContrastChecker.jsx
│   │       ├── PaletteGenerator.jsx
│   │       ├── QRGenerator.jsx
│   │       └── SchemaGenerator.jsx
│   │
│   ├── css/
│   │   ├── admin.css              # Admin styles
│   │   ├── tools.css              # Tool-specific styles
│   │   └── components.css         # Component styles
│   │
│   └── views/
│       └── admin-page.php         # PHP template for admin page
│
├── assets/                         # Static assets
│   ├── images/
│   │   ├── icon-128x128.png
│   │   ├── icon-256x256.png
│   │   └── banner-1544x500.png    # For WordPress.org
│   └── screenshots/               # For WordPress.org
│
├── languages/                      # i18n files
│   └── mlc-web-dev-tools.pot
│
└── tests/                          # Unit tests (future)
    └── phpunit/
```

### Component Architecture

**React Component Tree:**
```
App
├── Sidebar
│   └── NavItem (multiple)
├── Header
│   ├── HelpButton
│   └── ProButton
└── ToolContainer
    ├── ToolCard
    │   ├── Preview
    │   ├── Controls
    │   └── CodeBlock
    └── (Tool-specific components)
```

**State Management:**
- React Context API for global state (current tool, pro status)
- Local component state for tool-specific data
- localStorage for user preferences
- No Redux (overkill for this scope)

### Data Flow

**User Interaction:**
```
User adjusts control
  → React state updates
  → Preview re-renders (live)
  → Code output updates
  → User copies code
  → Success feedback
```

**Tool Switching:**
```
User clicks nav item
  → Route changes (no page reload)
  → New tool component mounts
  → Previous tool unmounts
  → URL updates (for bookmarking)
```

## Design System

See `WIREFRAMES.md` for complete visual specifications.

**Key Principles:**
1. **Minimal & Clean** - No clutter, focus on tools
2. **Instant Feedback** - Live previews everywhere
3. **One-Click Actions** - Copy buttons on all outputs
4. **WordPress Native** - Respects admin color schemes
5. **Responsive** - Works on all screen sizes

**Design Tokens:**
- Spacing: 8px base unit (8, 16, 24, 32, 48)
- Colors: WordPress admin palette + MLC blue accent
- Typography: System fonts, 13-18px range
- Shadows: Subtle, 3-level system

## Development Roadmap

### Phase 1: Foundation (Week 1)
**Goal:** Basic plugin structure + 1 working tool

- [ ] Initialize plugin boilerplate
- [ ] Set up @wordpress/scripts build system
- [ ] Create admin menu and page
- [ ] Build React app shell with routing
- [ ] Implement Sidebar navigation
- [ ] Build ToolCard template component
- [ ] Create CSS Gradient Generator (proof of concept)
- [ ] Test on local WordPress install

**Deliverable:** Working gradient generator in WordPress admin

### Phase 2: Core Tools (Week 2-3)
**Goal:** Complete all 7 free tools

- [ ] Box Shadow Generator
- [ ] Color Converter
- [ ] Color Contrast Checker
- [ ] Color Palette Generator
- [ ] QR Code Generator
- [ ] Schema.org Generator (basic types)
- [ ] Polish UI/UX across all tools
- [ ] Add help tooltips
- [ ] Test on multiple WordPress versions

**Deliverable:** Feature-complete free version

### Phase 3: Polish & Testing (Week 4)
**Goal:** Production-ready for WordPress.org

- [ ] Comprehensive testing (manual + automated if time)
- [ ] Accessibility audit (WCAG AA)
- [ ] Performance optimization
- [ ] i18n/l10n setup (translation-ready)
- [ ] WordPress.org assets (screenshots, banner, icon)
- [ ] Write comprehensive readme.txt
- [ ] Security audit (nonces, sanitization, escaping)
- [ ] WordPress.org submission prep

**Deliverable:** Submitted to WordPress.org

### Phase 4: Pro Features (Month 2)
**Goal:** Monetization system + advanced tools

- [ ] Integrate Freemius SDK (licensing)
- [ ] Build CSS Animation Builder
- [ ] Build Flexbox/Grid Playground
- [ ] Add advanced schema types (50+)
- [ ] Custom snippet library with save/load
- [ ] Bulk operations interface
- [ ] Remove branding option
- [ ] Payment gateway setup
- [ ] Pro upgrade flow

**Deliverable:** Paid Pro version available

### Phase 5: Marketing & Growth (Ongoing)
**Goal:** User acquisition and feedback

- [ ] Launch blog post / case study
- [ ] Submit to WordPress plugin directories
- [ ] Reach out to WordPress communities
- [ ] Gather user feedback
- [ ] Iterate based on reviews
- [ ] Add requested features
- [ ] Build email list for updates

## WordPress.org Submission Requirements

**Must-have for approval:**
- ✅ GPL-compatible license
- ✅ No "phone home" without user consent
- ✅ Proper sanitization/escaping (XSS prevention)
- ✅ Nonces on all forms (CSRF prevention)
- ✅ Capability checks on admin pages
- ✅ Unique plugin slug/prefix
- ✅ No external dependencies (all JS/CSS bundled)
- ✅ Translation-ready
- ✅ Readme.txt with proper format
- ✅ Screenshots (PNG format, proper size)
- ✅ Icon (128x128 and 256x256)
- ✅ Banner (1544x500 and 772x250)

**Best Practices:**
- Semantic versioning (1.0.0, 1.1.0, etc.)
- Changelog in readme.txt
- Tested up to: WordPress 6.7+
- Requires at least: WordPress 5.8
- Requires PHP: 7.4
- License: GPLv3
- Stable tag: [current version]

## Security Considerations

**Input Validation:**
- Sanitize all user inputs
- Escape all outputs
- Use WordPress sanitization functions

**CSRF Protection:**
- Nonces on all forms
- Verify nonces on submission

**XSS Prevention:**
- Escape HTML output with `esc_html()`, `esc_attr()`, etc.
- Sanitize URLs with `esc_url()`

**SQL Injection:**
- Use `$wpdb->prepare()` for all queries
- Or avoid custom queries entirely (use WP functions)

**Capability Checks:**
- All admin pages: `current_user_can('manage_options')`
- All AJAX endpoints: capability checks

**File Security:**
- No direct file access (check for `ABSPATH`)
- No arbitrary file uploads
- No eval() or similar

## Performance Optimization

**Asset Loading:**
- Only load on plugin admin page (not site-wide)
- Minify/concatenate JS/CSS in production
- Use WordPress asset versioning for cache busting

**Code Splitting:**
- Lazy load tool components (React.lazy)
- Load QR/color libraries only when tool is active

**Database:**
- No database writes unless Pro features require it
- Use WordPress transients for caching if needed

**Best Practices:**
- No inline styles/scripts (use wp_enqueue)
- Defer non-critical JS
- Minimize DOM operations

## Testing Strategy

**Manual Testing:**
- Test on fresh WordPress install
- Test with popular themes (Twenty Twenty-Four, Astra, GeneratePress)
- Test with popular plugins (Yoast, WooCommerce, Elementor)
- Test on different PHP versions (7.4, 8.0, 8.1, 8.2, 8.3)
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile responsive testing

**Automated Testing (Future):**
- PHPUnit for PHP logic
- Jest for React components
- WordPress Plugin Check plugin
- PHP_CodeSniffer for WordPress standards

## Documentation

**User Documentation:**
- Plugin page on MLC website
- Video tutorials for each tool
- FAQ section
- Use cases / examples

**Developer Documentation:**
- Inline code comments (PHPDoc)
- Component prop documentation
- Architecture decision records
- Contributing guidelines (if open source)

## Support Strategy

**Free Users:**
- WordPress.org support forum (community support)
- Response within 3-5 days
- FAQ / documentation

**Pro Users:**
- Email support (support@mosaiclifecreative.com)
- Response within 24 hours
- Priority bug fixes

## Marketing & Positioning

**Plugin Description:**
> "Web Dev Tools is the ultimate utility toolbox for WordPress developers and designers. Generate CSS gradients, box shadows, QR codes, schema markup, and more—all without leaving your WordPress admin. Built by Mosaic Life Creative, a WordPress agency that builds real sites every day. We built these tools because we needed them. Now you can use them too."

**Key Selling Points:**
1. All-in-one solution (no more browser tabs)
2. WordPress-integrated workflow
3. Built by developers for developers
4. Clean, minimal interface
5. Free forever (with optional Pro upgrade)

**Target Keywords:**
- WordPress developer tools
- CSS gradient generator WordPress
- QR code generator plugin
- Schema markup generator
- WordPress utilities

**Launch Strategy:**
1. Submit to WordPress.org
2. Post on r/ProWordPress
3. Tweet to #WordPress community
4. Post on WP Tavern forums
5. Reach out to WordPress newsletters
6. Create demo video on YouTube
7. Write blog post on MLC site

## Maintenance Plan

**Regular Updates:**
- Compatibility with new WordPress versions
- Security patches as needed
- Bug fixes based on user reports

**Feature Additions:**
- Quarterly releases with new tools
- User-requested features
- Pro tool enhancements

**Version Strategy:**
- Major releases: 1.0, 2.0 (breaking changes)
- Minor releases: 1.1, 1.2 (new features)
- Patch releases: 1.1.1, 1.1.2 (bug fixes)

## Success Metrics

**Year 1 Goals:**
- 1,000 active installs
- 4.5+ star rating on WordPress.org
- 30 Pro customers ($1,170 revenue)
- 90% positive reviews

**Year 2 Goals:**
- 10,000 active installs
- 300 Pro customers ($11,700 revenue)
- Featured in WordPress Weekly newsletters
- Partnerships with WordPress educators

**Long-term Vision:**
- Become the go-to utility plugin for WP developers
- 50,000+ installs
- $50K+ annual recurring revenue
- Hire support/development help
- Build ecosystem (integrations, extensions)

## Legal & Licensing

**License:** GPL-3.0 (required for WordPress.org)

**Attribution:**
- QRCode.js: MIT License (compatible)
- Color.js: MIT License (compatible)
- React: MIT License (compatible)
- @wordpress/scripts: GPL-2.0+ (compatible)

**Privacy:**
- No external API calls without user consent
- No analytics by default
- No data collection
- Privacy policy template for Pro users

**Terms:**
- Pro license: 1 year, 1 site, auto-renews
- Refund policy: 30 days
- Support policy: 1 year with license

## Team & Roles

**Trey (Solo Developer):**
- Plugin development (PHP + React)
- UI/UX design
- Testing and QA
- WordPress.org submission
- Support (initially)
- Marketing

**Future Hires (If Successful):**
- Support specialist (Pro users)
- Content creator (tutorials, docs)
- Designer (Pro tools, marketing assets)

## Next Steps

1. ✅ Create `claude.md` (this file)
2. ✅ Create `WIREFRAMES.md`
3. ⏭️ Initialize plugin boilerplate
4. ⏭️ Set up React + @wordpress/scripts
5. ⏭️ Build first tool (CSS Gradient Generator)
6. ⏭️ Test locally
7. ⏭️ Iterate and build remaining tools

**Let's build this thing! 🚀**