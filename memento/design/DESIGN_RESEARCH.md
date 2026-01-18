# Design Research: Collaborative Notes and Productivity Apps

> Research conducted January 2025 using Playwright automated analysis and web research.
> Screenshots available in `./research-screenshots/`

---

## Table of Contents
1. [Notion](#notion)
2. [Linear](#linear)
3. [Craft](#craft)
4. [Obsidian](#obsidian)
5. [Cross-App Patterns](#cross-app-patterns)
6. [Recommendations for Distinctive Design](#recommendations-for-distinctive-design)

---

## Notion

### Overview
Notion exemplifies a warm, approachable design language with extensive customization. Their design system prioritizes flexibility while maintaining visual coherence.

### Color Palette

#### Core Neutrals (Light Mode)
| Name | Hex | Usage |
|------|-----|-------|
| Gray 100 | `#f9f9f8` | Subtle backgrounds |
| Gray 200 | `#f6f5f4` | Card backgrounds, hover states |
| Gray 300 | `#dfdcd9` | Borders, dividers |
| Gray 400 | `#a39e98` | Muted text, icons |
| Gray 500 | `#78736f` | Secondary text |
| Gray 600 | `#615d59` | Body text |
| Gray 700 | `#494744` | Emphasized text |
| Gray 800 | `#31302e` | Headings |
| Gray 900 | `#191918` | Primary text |

#### Accent Colors
| Name | Hex | Usage |
|------|-----|-------|
| Blue 100 | `#f2f9ff` | Light blue backgrounds |
| Blue 200 | `#e6f3fe` | Hover states, selections |
| Blue 300 | `#93cdfe` | Links, highlights |
| Blue 400 | `#62aef0` | Interactive elements |
| Blue 500 | `#097fe8` | Primary actions |
| Blue 600 | `#0075de` | Primary buttons |
| Blue 700 | `#005bab` | Pressed states |
| Red 400 | `#f77463` | Warnings, alerts |
| Red 500 | `#f64932` | Errors, destructive actions |
| Green 500 | `#1aae39` | Success states |
| Yellow 500 | `#ffb110` | Highlights, tags |
| Purple 500 | `#9849e8` | Special features |
| Teal 500 | `#27918d` | Alternative accent |
| Orange 500 | `#ff6d00` | Notifications |
| Pink 500 | `#ff64c8` | Creative features |

#### Alpha/Transparency Colors
```css
--color-alpha-black-100: #0000000d;  /* 5% */
--color-alpha-black-200: #0000001a;  /* 10% */
--color-alpha-black-300: #0003;       /* ~19% */
--color-alpha-black-500: #0000008a;  /* ~54% */
```

### Typography System

#### Font Families
```css
/* Primary Sans */
--font-family-sans: NotionInter, Inter, -apple-system, BlinkMacSystemFont,
  "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif;

/* Serif (for documents) */
--font-family-serif: "Lyon Text", Georgia, YuMincho, "Hiragino Mincho ProN",
  "Songti TC", SimSun, Batang, serif;

/* Monospace */
--font-family-mono: "iA Writer Mono", Nitti, Menlo, Courier, monospace;

/* Handwriting */
--font-family-handwriting: "Permanent Marker", -apple-system, sans-serif;
```

#### Font Sizes (rem scale)
| Token | Size | Usage |
|-------|------|-------|
| font-size-50 | 0.75rem (12px) | Captions, metadata |
| font-size-100 | 0.875rem (14px) | Small body text |
| font-size-200 | 1rem (16px) | Default body |
| font-size-300 | 1.125rem (18px) | Large body |
| font-size-400 | 1.375rem (22px) | Subheading |
| font-size-500 | 1.625rem (26px) | H3 heading |
| font-size-600 | 2rem (32px) | H2 heading |
| font-size-700 | 2.625rem (42px) | H1 heading |
| font-size-800 | 3.375rem (54px) | Display |
| font-size-900 | 4rem (64px) | Large display |

#### Font Weights
```css
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Variable font versions */
--font-weight-variable-regular: 420;
--font-weight-variable-medium: 520;
--font-weight-variable-semibold: 620;
```

#### Letter Spacing
- Larger sizes use negative letter-spacing for tighter headings
- `font-size-700`: -0.125rem
- `font-size-900`: -0.1328rem

### Spacing System
```css
--spacing-4: 0.25rem;   /* 4px */
--spacing-8: 0.5rem;    /* 8px */
--spacing-12: 0.75rem;  /* 12px */
--spacing-16: 1rem;     /* 16px */
--spacing-20: 1.25rem;  /* 20px */
--spacing-24: 1.5rem;   /* 24px */
--spacing-32: 2rem;     /* 32px */
--spacing-40: 2.5rem;   /* 40px */
--spacing-48: 3rem;     /* 48px */
--spacing-64: 4rem;     /* 64px */
--spacing-96: 6rem;     /* 96px */
--spacing-128: 8rem;    /* 128px */
```

### Border Radius System
```css
--border-radius-200: 0.25rem;  /* 4px - Small chips */
--border-radius-400: 0.375rem; /* 6px - Buttons */
--border-radius-600: 0.625rem; /* 10px - Cards */
--border-radius-800: 0.875rem; /* 14px - Large cards */
--border-radius-round: 624.9375rem; /* Pill shapes */
```

### Shadows
```css
--shadow-level-100: 0px 3px 9px #00000008, 0px 0.7px 1.4625px rgba(0,0,0,.015);
--shadow-level-200: 0px 4px 18px #0000000a, 0px 2.025px 7.84688px rgba(0,0,0,.027);
--shadow-level-300: 0px 20px 50px #00000014, 0px 6px 16px #0000000a;
```

### Animation/Motion
```css
--motion-duration-100: 100ms;
--motion-duration-150: 150ms;
--motion-duration-200: 200ms;
--motion-duration-250: 250ms;
--motion-duration-300: 300ms;

/* Easing Functions */
--motion-timing-function-ease-in-out-quint: cubic-bezier(0.86, 0, 0.07, 1);
--motion-timing-function-ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
--motion-timing-function-ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
```

### Component Patterns

#### Sidebar Navigation
- Fixed width sidebar (~240px)
- Collapsible with hover-reveal icons
- Hierarchical page tree with drag-and-drop
- Workspace switcher at top with avatar
- Quick actions: Search, Settings, New page

#### Document Editor (Blocks)
- Slash command menu (`/`) for block types
- Hover handles for drag-and-drop
- Inline formatting toolbar on selection
- Block types: Text, Heading, List, Toggle, Callout, Code, Quote, Divider, Table, etc.
- Nested blocks with indentation

#### AI Features (Notion AI)
- Chat panel slides in from right
- Purple accent color for AI elements
- Streaming text response display
- Context-aware suggestions inline

### Key Observations
- **Warmth**: Notion uses slightly warm grays (brownish undertones) rather than pure grays
- **Flexibility**: Extensive block system allows infinite customization
- **Hierarchy**: Clear visual hierarchy through spacing and typography, not just color
- **Emoji-first**: Heavy use of emoji for page icons and quick recognition

---

## Linear

### Overview
Linear defines the "Linear style" - a dark-first, high-contrast, premium aesthetic that has become influential in B2B SaaS. Their design prioritizes efficiency and density without feeling cluttered.

### Color System Philosophy
Linear uses **LCH color space** instead of HSL for theme generation. LCH is perpetually uniform - colors with the same lightness value appear equally light to the human eye. Their theme system uses just three base values:
- Base color
- Accent color
- Contrast level

### Color Palette

#### Dark Theme Core
| Name | Hex | Usage |
|------|-----|-------|
| Background | `#08090a` | Main canvas |
| Surface 1 | `#0f1011` | Elevated surfaces |
| Surface 2 | `#141516` | Cards, panels |
| Surface 3 | `#181919` | Hover states |
| Surface 4 | `#1c1c1f` | Active states |
| Border | `#262626` | Subtle borders |
| Border Strong | `#282828` | Emphasized borders |
| Text Primary | `#f7f8f8` | Headings, body |
| Text Secondary | `#8a8f98` | Muted content |
| Text Tertiary | `#626669` | Disabled, hints |

#### Semantic Colors
| Name | Hex | Usage |
|------|-----|-------|
| Indigo (Brand) | `#5e6ad2` | Primary accent, buttons |
| Blue | `#4ea7fc` | Links, information |
| Green | `#68cc58` | Success, "Plan" |
| Yellow | `#d4b144` | Warnings, "Build" |
| Orange | `#f29940` | Notifications |
| Red | `#eb5757` | Errors, destructive |
| Purple | `#b59aff` | Special features |
| Teal | `#02b8cc` | Alternative accent |

#### Status Colors (Used in issues/tasks)
```css
--color-linear-plan: #68cc58;
--color-linear-build: #d4b144;
--color-linear-security: #7a7fad;
```

### Typography System

#### Font Families
```css
/* Primary Sans */
--font-regular: "Inter Variable", "SF Pro Display", -apple-system,
  "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
  "Open Sans", "Helvetica Neue", sans-serif;

/* Monospace */
--font-monospace: "Berkeley Mono", ui-monospace, "SF Mono", Menlo, monospace;

/* Serif Display (Marketing) */
--font-serif-display: "Tiempos Headline", ui-serif, Georgia, Times, serif;
```

#### Font Sizes
| Token | Size | Usage |
|-------|------|-------|
| font-size-tiny | 0.625rem (10px) | Micro labels |
| font-size-micro | 0.75rem (12px) | Metadata |
| font-size-mini | 0.8125rem (13px) | Dense UI |
| font-size-small | 0.8125rem (13px) | Secondary text |
| font-size-regular | 0.9375rem (15px) | Body text |
| font-size-large | 1.125rem (18px) | Emphasized text |
| title-1 | 1.0625rem (17px) | Small title |
| title-4 | 2rem (32px) | Section heading |
| title-7 | 3.5rem (56px) | Hero text |
| title-9 | 4.5rem (72px) | Display |

#### Font Weights
```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 510;    /* Subtle medium */
--font-weight-semibold: 590;  /* Softer semibold */
--font-weight-bold: 680;      /* Refined bold */
```

#### Letter Spacing
```css
--title-1-letter-spacing: -0.012em;
--title-4-letter-spacing: -0.022em;  /* Tighter for larger sizes */
--text-regular-letter-spacing: -0.011em;
```

### Spacing & Layout
```css
--header-height: 64px;
--page-padding-inline: 24px;
--page-padding-block: 64px;
--page-max-width: 1024px;
--prose-max-width: 624px;
--grid-columns: 12;
```

### Border Radius
```css
--radius-4: 4px;
--radius-6: 6px;
--radius-8: 8px;
--radius-12: 12px;
--radius-16: 16px;
--radius-24: 24px;
--radius-rounded: 9999px;  /* Pill */
--radius-circle: 50%;
```

### Animation System
```css
/* Duration */
--speed-quickTransition: 0.1s;
--speed-regularTransition: 0.25s;
--speed-highlightFadeIn: 0s;
--speed-highlightFadeOut: 0.15s;

/* Easing (comprehensive) */
--ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
--ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
--ease-in-out-quint: cubic-bezier(0.86, 0, 0.07, 1);
```

### Z-Index System
```css
--layer-max: 10000;
--layer-tooltip: 1100;
--layer-dialog: 700;
--layer-command-menu: 650;
--layer-popover: 600;
--layer-header: 100;
```

### Component Patterns

#### Command Palette (Cmd+K)
- Global keyboard shortcut
- Full-width modal with blur backdrop
- Icon + label for each action
- Keyboard shortcut hints on right
- Search with fuzzy matching
- Grouped results by category

#### List/Detail View
- Left panel: Dense list with status icons
- Right panel: Full detail view
- Resizable divider
- Keyboard navigation (j/k)
- Quick actions on hover

#### Status Indicators
- Circular progress indicators
- Color-coded priority badges
- Subtle icons (not text-heavy)

### Key Observations
- **Density**: UI is information-dense but readable
- **Keyboard-first**: Extensive keyboard shortcuts for power users
- **Dark-first**: Designed for dark mode, light is secondary
- **Subtle gradients**: Uses very subtle linear gradients for depth
- **Glassmorphism**: Blur effects on overlays and headers

---

## Craft

### Overview
Craft brings Apple-like design sensibility to notes, with a focus on visual beauty and card-based organization. Native feel with careful attention to typography.

### Color Palette (Extracted)

#### Core Colors
| Name | Hex | Usage |
|------|-----|-------|
| Background | `#fcf9f7` | Warm white canvas |
| Surface | `#f5f5f7` | Card backgrounds |
| Surface Alt | `#f7f7f7` | Alternate surfaces |
| Text Primary | `#030302` | Near-black text |
| Text Secondary | `#030302` @ 75% | Muted text |
| Text Tertiary | `#030302` @ 50% | Hint text |
| Text Disabled | `#030302` @ 25% | Disabled |

#### Accent Colors
| Name | Hex | Usage |
|------|-----|-------|
| Blue Primary | `#0087ff` | Links, actions |
| Blue Light | `#54a3ff` | Hover states |
| Blue Background | `#dbedfe` | Blue highlights |
| Lavender | `#b8caf5` | Soft accents |
| Peach | `#ffdbc5` | Warm highlights |
| Cream | `#fff3e7` | Warm backgrounds |
| Yellow | `#fde99b` | Highlights |
| Gold | `#dfb720` | Premium features |
| Gold Dark | `#987e1b` | Gold text |

### Typography System

#### Font Families
```css
/* Primary Sans */
UntitledSansFont, "UntitledSansFont Fallback", -apple-system, Inter,
  "Inter Fallback", "system-ui", "Helvetica Neue", Helvetica, Arial, sans-serif;

/* Serif (Document option) */
UntitledSerifFont, "UntitledSerifFont Fallback", apple-system-ui-serif,
  ui-serif, Georgia, serif;

/* System fallback */
-apple-system, Inter, "Inter Fallback", "system-ui", "Helvetica Neue",
  Helvetica, Arial, sans-serif;
```

### Component Patterns

#### Card-Based Blocks
- Five card layout options (varying sizes)
- Custom fonts per card
- Background colors and images
- Cover images with blur effects
- Card grid and list view toggle

#### Nested Pages
- Pages styled as blocks
- Click to navigate inside
- Collapse/expand for hierarchy
- Breadcrumb trail navigation

#### Document Canvas
- Full-width centered content
- Page style extends to app chrome
- Cover images with parallax
- Smooth page transitions

#### Block Types
- Slash command (`/`) for block menu
- Text alignment options
- Indent controls
- Block-level styling (colors, fonts)

### Key Observations
- **Native feel**: Uses system fonts and native components where possible
- **Warmth**: Warm white backgrounds, soft shadows
- **Visual richness**: Heavy use of imagery and color
- **Document-centric**: UI adapts to document style
- **Apple aesthetic**: San Francisco-inspired typography and spacing

---

## Obsidian

### Overview
Obsidian is a power-user tool with deep customization. The design emphasizes the graph view and interconnected thinking, with a plugin-driven extensible UI.

### Color Palette (Dark Theme Default)

#### Core Colors
| Name | Hex | Usage |
|------|-----|-------|
| Background | `#0f0f0f` | Main canvas |
| Background Secondary | `#171717` | Sidebars |
| Background Tertiary | `#1f1f1f` | Cards, modals |
| Surface | `#262626` | Elevated elements |
| Border | `#525252` | Dividers |
| Text Primary | `#eeeeee` | Headings |
| Text Secondary | `#bcbcbc` | Body |
| Text Muted | `#a3a3a3` | Hints |
| Text Faint | `#e5e5e5` | Subtle |

#### Accent Colors (Default theme)
| Name | Hex | Usage |
|------|-----|-------|
| Purple Primary | `#7c3aed` | Primary accent |
| Purple Light | `#a78bfa` | Hover states |
| Purple Vivid | `#8b5cf6` | Links |
| Green | `#22c55e` | Success |
| Green Dark | `#14532d` | Green backgrounds |
| Yellow | `#eab308` | Warnings |
| Yellow Dark | `#713f12` | Yellow backgrounds |

### Typography System

#### Font Family
```css
ui-sans-serif, system-ui, -apple-system, "system-ui", Roboto, Inter,
  "Helvetica Neue", Arial, "Noto Sans", sans-serif,
  "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"
```

### CSS Variables Architecture

Obsidian exposes **400+ CSS variables** organized into:

1. **Foundations**
   - Colors
   - Typography
   - Spacing

2. **Components**
   - Buttons
   - Inputs
   - Cards
   - Modals

3. **Editor**
   - Syntax highlighting
   - Block styles
   - Link styles

#### Key Variables
```css
/* Background hierarchy */
--background-primary: var(--color-base-00);
--background-secondary: var(--color-base-10);
--background-modifier-hover: var(--color-base-20);
--background-modifier-active: var(--color-base-25);

/* Text hierarchy */
--text-normal: var(--color-base-100);
--text-muted: var(--color-base-70);
--text-faint: var(--color-base-50);
--text-on-accent: var(--color-base-00);

/* Interactive colors */
--interactive-normal: var(--color-base-00);
--interactive-hover: var(--color-base-10);
--interactive-accent: var(--color-accent);
```

### Component Patterns

#### Graph View
- Force-directed node layout
- Canvas-based rendering (not CSS)
- Node colors by tag/folder
- Relationship lines with opacity
- Zoom and pan controls
- Filter options panel

#### Linked Notes (Backlinks)
- Backlinks panel in sidebar
- Unlinked mentions section
- Link preview on hover
- Quick create from selection

#### Plugin Architecture UI
- Settings page per plugin
- Toggle switches for enable/disable
- Search in plugin marketplace
- Author/download count metadata
- Install/Update buttons

#### File Explorer
- Tree view with expand/collapse
- File icons by type
- Drag-and-drop organization
- Right-click context menu
- Quick switcher (Cmd+O)

### Theming System

Themes use CSS selectors:
```css
.theme-light { /* Light mode variables */ }
.theme-dark { /* Dark mode variables */ }
body { /* Shared variables */ }
.is-mobile { /* Mobile-specific overrides */ }
```

### Key Observations
- **Power user focus**: Dense UI with many options
- **Extensibility**: Everything is customizable
- **Graph-centric**: Unique selling point is visualizing connections
- **Local-first**: Emphasizes data ownership
- **Community themes**: Minimal theme (by kepano) is most popular

---

## Cross-App Patterns

### Common Design Elements

#### Typography
| App | Primary Font | Approach |
|-----|-------------|----------|
| Notion | Inter (custom "NotionInter") | Warm, readable |
| Linear | Inter Variable | Dense, precise |
| Craft | Untitled Sans | Apple-like elegance |
| Obsidian | System fonts | Customizable |

#### Color Philosophy
| App | Approach | Key Characteristic |
|-----|----------|-------------------|
| Notion | Warm neutrals | Approachable, flexible |
| Linear | Cool darks | Professional, focused |
| Craft | Warm whites | Beautiful, native |
| Obsidian | Deep blacks | Customizable, developer |

#### Spacing Scales
All use an 8px base grid with 4px for fine adjustments.

### Shared Interaction Patterns

1. **Slash Commands** (`/`)
   - Notion, Craft, Obsidian all use this
   - Quick block/command insertion
   - Fuzzy search matching

2. **Command Palettes** (`Cmd+K`)
   - Linear defines the gold standard
   - Quick actions, navigation, search
   - Keyboard shortcut hints

3. **Sidebar Navigation**
   - Collapsible panel
   - Hierarchical structure
   - Drag-and-drop organization
   - Workspace/vault switching

4. **Block-Based Editing**
   - Notion pioneered, others adopted
   - Drag handles on hover
   - Nested structures
   - Type transformation

### Dark Mode Implementation

| App | Approach |
|-----|----------|
| Notion | CSS variables with `--color-` prefix, separate light/dark values |
| Linear | LCH color space generation, three base values |
| Craft | Document style bleeds to chrome |
| Obsidian | `.theme-light` / `.theme-dark` class selectors |

### AI Feature Integration

| App | AI Implementation |
|-----|-------------------|
| Notion | Notion AI - side panel chat, inline suggestions, purple accent |
| Linear | AI-powered issue suggestions, natural language queries |
| Craft | AI Assistant for writing, summarization |
| Obsidian | Plugins (ChatGPT, Copilot integrations) |

---

## Recommendations for Distinctive Design

Based on this research, here are recommendations for creating a distinctive design system that avoids generic AI aesthetics:

### 1. Color Strategy

**Avoid:**
- Pure blacks and whites (#000, #fff)
- Generic blues (#007bff, #2196f3)
- Gradient-heavy designs without purpose

**Consider:**
- **Warm neutrals** like Notion (brownish grays)
- **Purposeful accent color** that carries meaning (Linear's indigo = action)
- **LCH/OKLCH color space** for perceptually uniform palettes

**Suggested Palette Direction:**
```css
/* A distinctive warm-cool balance */
--background-primary: #0d0d0f;    /* Slightly blue-black */
--background-secondary: #16161a;  /* Warm dark */
--accent-primary: #6366f1;        /* Indigo family */
--accent-secondary: #8b5cf6;      /* Purple complement */
--text-primary: #f1f1f4;          /* Warm white */
--text-muted: #71717a;            /* Zinc */
```

### 2. Typography Strategy

**Key Decisions:**
- **Inter Variable** is the safest, most versatile choice
- **Berkeley Mono** for code is premium
- Consider **custom weight values** (510, 590) for subtle refinement

**Recommended Scale:**
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.8125rem;  /* 13px - Linear's dense UI */
--text-base: 0.9375rem; /* 15px - comfortable reading */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.5rem;     /* 24px */
--text-2xl: 2rem;      /* 32px */
--text-3xl: 2.5rem;    /* 40px */
```

### 3. Spacing Strategy

Use **4px/8px base** but define purposeful tokens:
```css
--space-1: 4px;   /* Tight grouping */
--space-2: 8px;   /* Default gap */
--space-3: 12px;  /* Comfortable gap */
--space-4: 16px;  /* Section gap */
--space-6: 24px;  /* Large section gap */
--space-8: 32px;  /* Page section */
```

### 4. Animation Strategy

**Linear's approach is best-in-class:**
```css
--duration-fast: 100ms;
--duration-normal: 200ms;
--duration-slow: 300ms;

/* Prefer ease-out for UI responses */
--ease-out: cubic-bezier(0.165, 0.84, 0.44, 1);
/* Use ease-in-out for state changes */
--ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);
```

### 5. Distinctive Elements to Consider

1. **Graph/Connection Visualization** (Obsidian's unique feature)
   - Visualize relationships between notes/entities
   - Use subtle animations for node connections

2. **Adaptive Chrome** (Craft's innovation)
   - Let document/context influence app appearance
   - Creates emotional connection to content

3. **Density Modes** (Linear's approach)
   - Offer compact/comfortable/spacious settings
   - Power users want density; newcomers need breathing room

4. **Sound Design** (Craft mentions)
   - Subtle audio feedback for actions
   - Optional but distinctive

### 6. Anti-Patterns to Avoid

1. **Gradient buttons** - overused in AI products
2. **Purple as primary** - saturated market
3. **Glassmorphism everywhere** - dated when overused
4. **Skeuomorphic shadows** - can feel heavy
5. **Animated gradients** - distracting, battery-draining
6. **Chat-centric AI UI** - ubiquitous, consider alternatives

### 7. Distinctive Opportunities

1. **Time-aware UI** - colors/density shift with time of day
2. **Content-aware theming** - derive palette from content
3. **Spatial interfaces** - beyond linear document flow
4. **Ambient presence** - subtle indicators of collaborative activity
5. **Progressive disclosure** - reveal complexity as users advance

---

## Research Sources

- [Linear Brand Guidelines](https://linear.app/brand)
- [How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Linear Design System (Figma Community)](https://www.figma.com/community/file/1222872653732371433/linear-design-system)
- [Notion Colors Documentation](https://docs.super.so/notion-colors)
- [Notionpresso CSS Guide](https://notionpresso.com/en/docs/customization-guide/css-structure-and-styling)
- [Obsidian CSS Variables](https://docs.obsidian.md/Reference/CSS+variables/Foundations/Colors)
- [Obsidian Minimal Theme](https://github.com/kepano/obsidian-minimal)
- [Craft App Style](https://support.craft.do/hc/en-us/articles/19224488955676-App-Style-in-Craft)
- [The rise of Linear style design](https://medium.com/design-bootcamp/the-rise-of-linear-style-design-origins-trends-and-techniques-4fd96aab7646)

---

*Document generated from automated Playwright analysis and web research, January 2025.*
