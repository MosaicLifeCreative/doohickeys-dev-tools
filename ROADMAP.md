# Web Dev Tools - Week 1 Roadmap

**Goal:** Get a working CSS Gradient Generator running in WordPress admin by end of week.

## Day 1: Project Setup

### Morning: Initialize Plugin Structure
```bash
# Create plugin directory
mkdir mlc-web-dev-tools
cd mlc-web-dev-tools

# Initialize npm
npm init -y

# Install WordPress scripts
npm install @wordpress/scripts --save-dev

# Install React dependencies (already included in @wordpress/scripts)
# Install additional libraries
npm install qrcode.react chroma-js --save
```

**Create core files:**
- `mlc-web-dev-tools.php` (main plugin file)
- `readme.txt` (WordPress.org format)
- `.gitignore`
- `package.json` (update scripts)

**Main plugin file template:**
```php
<?php
/**
 * Plugin Name: Web Dev Tools by MLC
 * Plugin URI: https://mosaiclifecreative.com/web-dev-tools
 * Description: Essential utilities for web developers—right in your WordPress dashboard.
 * Version: 1.0.0
 * Author: Mosaic Life Creative
 * Author URI: https://mosaiclifecreative.com
 * License: GPL-3.0+
 * License URI: http://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: mlc-web-dev-tools
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('MLC_WDT_VERSION', '1.0.0');
define('MLC_WDT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('MLC_WDT_PLUGIN_URL', plugin_dir_url(__FILE__));

// Load main plugin class
require_once MLC_WDT_PLUGIN_DIR . 'includes/class-plugin.php';

// Initialize plugin
function mlc_wdt_init() {
    $plugin = new MLC_Web_Dev_Tools_Plugin();
    $plugin->run();
}
add_action('plugins_loaded', 'mlc_wdt_init');
```

### Afternoon: Build System Configuration

**Update `package.json` scripts:**
```json
{
  "scripts": {
    "start": "wp-scripts start",
    "build": "wp-scripts build",
    "format": "wp-scripts format",
    "lint:css": "wp-scripts lint-style",
    "lint:js": "wp-scripts lint-js",
    "packages-update": "wp-scripts packages-update"
  }
}
```

**Create `admin/js/index.jsx`:**
```jsx
import { render } from '@wordpress/element';
import App from './App';
import './index.css';

// Mount React app
const container = document.getElementById('mlc-wdt-app');
if (container) {
    render(<App />, container);
}
```

**Test build system:**
```bash
npm start  # Should compile without errors
```

---

## Day 2: Admin Interface & React Shell

### Morning: PHP Admin Setup

**Create `includes/class-admin.php`:**
- Add admin menu item
- Enqueue React app
- Create admin page template

**Key functions:**
```php
add_action('admin_menu', [$this, 'add_admin_menu']);
add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
```

**Admin page renders:**
```html
<div id="mlc-wdt-app"></div>
```

### Afternoon: React App Shell

**Create `admin/js/App.jsx`:**
```jsx
import { useState } from '@wordpress/element';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ToolContainer from './components/ToolContainer';

export default function App() {
    const [currentTool, setCurrentTool] = useState('gradient');

    return (
        <div className="mlc-wdt">
            <Header />
            <div className="mlc-wdt-layout">
                <Sidebar 
                    currentTool={currentTool}
                    onToolChange={setCurrentTool}
                />
                <ToolContainer currentTool={currentTool} />
            </div>
        </div>
    );
}
```

**Create components:**
- `Sidebar.jsx` - Navigation menu
- `Header.jsx` - Top bar with help/pro buttons
- `ToolContainer.jsx` - Main content area

---

## Day 3: Sidebar Navigation & Routing

### Morning: Sidebar Component

**Create `components/Sidebar.jsx`:**
```jsx
const tools = [
    {
        category: 'CSS Tools',
        icon: '🎨',
        items: [
            { id: 'gradient', label: 'Gradient' },
            { id: 'box-shadow', label: 'Box Shadow' }
        ]
    },
    {
        category: 'Schema',
        icon: '📊',
        items: [
            { id: 'schema', label: 'Generator' }
        ]
    },
    // ... etc
];

export default function Sidebar({ currentTool, onToolChange }) {
    return (
        <nav className="mlc-wdt-sidebar">
            {tools.map(category => (
                <div key={category.category}>
                    <h3>{category.icon} {category.category}</h3>
                    {category.items.map(tool => (
                        <button
                            key={tool.id}
                            className={currentTool === tool.id ? 'active' : ''}
                            onClick={() => onToolChange(tool.id)}
                        >
                            {tool.label}
                        </button>
                    ))}
                </div>
            ))}
        </nav>
    );
}
```

### Afternoon: Routing & Deep Linking

**Add URL hash routing:**
```jsx
// In App.jsx
useEffect(() => {
    // Set initial tool from URL hash
    const hash = window.location.hash.replace('#', '');
    if (hash) setCurrentTool(hash);

    // Update URL when tool changes
    window.location.hash = currentTool;
}, [currentTool]);
```

**Test navigation:**
- Click tools, verify hash updates
- Refresh page, verify tool persists
- Back/forward buttons work

---

## Day 4: Tool Card Template & Reusable Components

### Morning: ToolCard Component

**Create `components/ToolCard.jsx`:**
```jsx
export default function ToolCard({ 
    title, 
    help, 
    preview, 
    controls, 
    output 
}) {
    return (
        <div className="mlc-wdt-tool-card">
            <header>
                <h2>{title}</h2>
                <button className="help-btn" title={help}>?</button>
            </header>

            <div className="preview-area">
                {preview}
            </div>

            <div className="controls-area">
                {controls}
            </div>

            <div className="output-area">
                {output}
            </div>
        </div>
    );
}
```

### Afternoon: Utility Components

**Create `components/CodeBlock.jsx`:**
```jsx
export default function CodeBlock({ code, language = 'css' }) {
    return (
        <div className="code-block">
            <pre>
                <code className={`language-${language}`}>
                    {code}
                </code>
            </pre>
        </div>
    );
}
```

**Create `components/CopyButton.jsx`:**
```jsx
import { useState } from '@wordpress/element';

export default function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button onClick={handleCopy} className="copy-btn">
            {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
    );
}
```

---

## Day 5: CSS Gradient Generator (Part 1)

### Morning: Gradient State Management

**Create `tools/GradientGenerator.jsx`:**
```jsx
import { useState } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CodeBlock from '../components/CodeBlock';
import CopyButton from '../components/CopyButton';

export default function GradientGenerator() {
    const [direction, setDirection] = useState(90); // degrees
    const [colors, setColors] = useState([
        { color: '#FF6B6B', position: 0 },
        { color: '#4ECDC4', position: 100 }
    ]);

    const generateCSS = () => {
        const colorStops = colors
            .map(c => `${c.color} ${c.position}%`)
            .join(', ');
        return `background: linear-gradient(${direction}deg, ${colorStops});`;
    };

    const preview = (
        <div 
            className="gradient-preview"
            style={{ 
                background: `linear-gradient(${direction}deg, ${colors.map(c => `${c.color} ${c.position}%`).join(', ')})`
            }}
        />
    );

    const controls = (
        <div>
            <label>
                Direction: {direction}°
                <input 
                    type="range" 
                    min="0" 
                    max="360" 
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                />
            </label>

            <h4>Colors</h4>
            {colors.map((color, i) => (
                <div key={i} className="color-stop">
                    <input 
                        type="color"
                        value={color.color}
                        onChange={(e) => {
                            const newColors = [...colors];
                            newColors[i].color = e.target.value;
                            setColors(newColors);
                        }}
                    />
                    <input 
                        type="number"
                        value={color.position}
                        onChange={(e) => {
                            const newColors = [...colors];
                            newColors[i].position = e.target.value;
                            setColors(newColors);
                        }}
                    />
                    {colors.length > 2 && (
                        <button onClick={() => {
                            setColors(colors.filter((_, idx) => idx !== i));
                        }}>×</button>
                    )}
                </div>
            ))}

            <button onClick={() => {
                setColors([...colors, { color: '#000000', position: 50 }]);
            }}>
                + Add Color
            </button>
        </div>
    );

    const output = (
        <div>
            <h4>Generated CSS</h4>
            <CodeBlock code={generateCSS()} />
            <CopyButton text={generateCSS()} />
        </div>
    );

    return (
        <ToolCard
            title="CSS Gradient Generator"
            help="Create linear gradients with live preview"
            preview={preview}
            controls={controls}
            output={output}
        />
    );
}
```

### Afternoon: Polish & Testing

**Add CSS styling** (`admin/css/tools.css`)
**Test interactions:**
- Direction slider updates preview
- Color picker changes colors live
- Position updates affect gradient
- Add/remove colors works
- Copy button copies CSS
- CSS output is valid

---

## Day 6: Styling & Polish

### Morning: Global Styles

**Create `admin/css/admin.css`:**
```css
/* Design tokens */
:root {
    --space-sm: 16px;
    --space-md: 24px;
    --space-lg: 32px;
    --primary: #0073aa;
    --text-primary: #23282d;
    --border: #c3c4c7;
}

/* Layout */
.mlc-wdt-layout {
    display: flex;
    gap: var(--space-md);
    margin: var(--space-md);
}

.mlc-wdt-sidebar {
    width: 200px;
    background: white;
    border: 1px solid var(--border);
    padding: var(--space-sm);
}

/* Tool card */
.mlc-wdt-tool-card {
    background: white;
    border: 1px solid var(--border);
    padding: var(--space-md);
    border-radius: 4px;
    max-width: 1200px;
}

.preview-area {
    min-height: 300px;
    border: 1px solid var(--border);
    margin: var(--space-md) 0;
}
```

### Afternoon: Component Styling

**Style individual components:**
- Sidebar navigation (hover states, active state)
- Tool cards (spacing, shadows)
- Buttons (primary, secondary, icon)
- Inputs (focus states, validation)
- Code blocks (syntax highlighting, monospace font)

---

## Day 7: Testing & Debugging

### Morning: Functionality Testing

**Test checklist:**
- [ ] Plugin activates without errors
- [ ] Admin menu appears correctly
- [ ] React app loads
- [ ] Sidebar navigation works
- [ ] Tool switching works (no page reload)
- [ ] Gradient generator preview updates live
- [ ] CSS output is correct and valid
- [ ] Copy button copies to clipboard
- [ ] All controls work as expected
- [ ] No console errors

### Afternoon: Cross-Browser Testing

**Test in:**
- Chrome (primary)
- Firefox
- Safari
- Edge

**Check for:**
- Layout issues
- CSS compatibility
- JavaScript errors
- Clipboard API support

---

## End of Week 1 Deliverable

✅ **Working plugin** that can be activated in WordPress  
✅ **Admin interface** with navigation and routing  
✅ **One complete tool** (CSS Gradient Generator) that:
- Has live preview
- Has interactive controls
- Generates valid CSS
- Has copy-to-clipboard functionality

✅ **Foundation for rapid development** of remaining tools

---

## Week 2 Preview: Core Tools

Using the template established in Week 1, build out:
- Day 8-9: Box Shadow Generator
- Day 10-11: QR Code Generator  
- Day 12-13: Color Tools (Converter, Contrast, Palette)
- Day 14: Schema Generator

**Same pattern for each:**
1. Create tool component
2. Manage state
3. Render preview
4. Render controls
5. Generate output
6. Test thoroughly

---

## Pro Tips

**If you get stuck:**
1. Check browser console for errors
2. Verify WordPress debug mode is on
3. Check Network tab for failed requests
4. Test with default WordPress theme
5. Disable other plugins temporarily

**Best practices:**
- Commit to Git after each day
- Test frequently (don't wait until end)
- Keep components small and focused
- Follow WordPress coding standards
- Document as you go

**Remember:**
- Don't over-engineer early
- Get something working first
- Refactor later
- Ship > Perfect

---

## Ready to Start?

1. Review `claude.md` for full context
2. Review `WIREFRAMES.md` for UI specs
3. Follow this roadmap day by day
4. Use Claude Code for assistance with specific implementation
5. Build in the open (commit frequently)

**Let's ship this! 🚀**