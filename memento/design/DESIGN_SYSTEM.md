# Memento Design System

A distinctive, premium design system for collaborative notes, inspired by Linear and Notion but with a unique identity.

## Design Philosophy

Memento's design system embodies these core principles:

- **Premium, not generic**: Avoids typical AI product aesthetics with warm color tones and subtle details
- **Efficiency-focused**: Dense information display without feeling cluttered (Linear-inspired)
- **Warm minimalism**: Slightly warm grays and cream whites for approachability (Notion-inspired)
- **Precise animations**: All transitions use 100-300ms durations with refined easing curves
- **Accessibility-first**: Proper focus states, ARIA labels, and keyboard navigation

## Color System

### Canvas (Backgrounds)
- `--canvas` (#0c0c0e): Main app background
- `--canvas-raised` (#141416): Elevated surfaces (sidebar, cards)
- `--canvas-overlay` (#1c1c1f): Modals, dropdowns, hover states
- `--canvas-inset` (#08080a): Inset areas, wells

### Ink (Text)
- `--ink` (#f5f4f1): Primary text (warm white)
- `--ink-muted` (#a8a5a0): Secondary text
- `--ink-faint` (#6b6966): Tertiary text, disabled states

### Accent Colors
- `--accent` (#8b7cf6): Soft violet - primary actions, links
- `--memory` (#f5a623): Amber - highlights, important notes
- `--success` (#4ade80): Green - success states
- `--warning` (#fbbf24): Yellow - warnings
- `--error` (#f87171): Red - errors, destructive actions

### Borders
- `--border` (#262628): Default borders
- `--border-strong` (#363638): Emphasized borders
- `--border-hover` (#404042): Hover state borders

## Typography

### Fonts
- **Primary**: Inter Variable (with OpenType features: cv02, cv03, cv04, cv11)
- **Monospace**: JetBrains Mono

### Scale
```css
/* Base: 15px (0.9375rem) - comfortable reading */
h1: 30px (1.875rem) - letter-spacing: -0.02em, line-height: 1.2
h2: 24px (1.5rem) - letter-spacing: -0.02em, line-height: 1.3
h3: 20px (1.25rem) - letter-spacing: -0.02em, line-height: 1.4
h4: 18px (1.125rem) - letter-spacing: -0.02em, line-height: 1.4
body: 15px (0.9375rem) - letter-spacing: -0.011em, line-height: 1.6
small: 13px (0.8125rem)
caption: 12px (0.75rem)
```

### Font Weights
- Regular: 400
- Medium: 510 (custom for subtle emphasis)
- Semibold: 590 (refined, not too heavy)

### OpenType Features
```css
font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
```
These features improve the appearance of Inter Variable:
- `cv02`: Open digits
- `cv03`: Curved r
- `cv04`: Single-story a
- `cv11`: Single-story g

## Spacing System

Based on 4px/8px grid:

```css
--spacing-1: 4px
--spacing-2: 8px
--spacing-3: 12px
--spacing-4: 16px
--spacing-5: 20px
--spacing-6: 24px
--spacing-8: 32px
--spacing-10: 40px
--spacing-12: 48px
```

## Border Radius

```css
--radius-sm: 6px  /* Small elements, chips */
--radius-md: 8px  /* Buttons, inputs */
--radius-lg: 12px /* Cards, modals */
--radius-xl: 16px /* Large containers */
```

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)
```

## Animation System

### Durations
- **Fast (100ms)**: Hover states, button presses
- **Normal (200ms)**: Most transitions, modals, dropdowns
- **Slow (300ms)**: Layout changes, sidebar collapse

### Easing Functions
```css
--ease-out: cubic-bezier(0.165, 0.84, 0.44, 1)     /* UI responses */
--ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1) /* State changes */
```

### Reduced Motion
Always respect user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Components

### UI Components

#### Button
4 variants with 3 sizes:
- **Primary**: Accent background, white text
- **Secondary**: Canvas raised background, bordered
- **Ghost**: Transparent, hover background
- **Danger**: Error muted background, error text

Sizes: `sm` (28px), `md` (36px), `lg` (44px)

```svelte
<Button variant="primary" size="md">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">More options</Button>
<Button variant="danger">Delete</Button>
<Button loading>Saving...</Button>
```

#### Input
Text inputs with variants:
- **Default**: Standard text input
- **Search**: Input with search icon

```svelte
<Input placeholder="Enter text..." />
<Input variant="search" placeholder="Search..." />
<Input type="email" error="Invalid email" />
```

#### Card
Container component with variants:
- **Default**: Raised background, bordered
- **Elevated**: With shadow
- **Bordered**: Strong border

```svelte
<Card class="p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>

<Card variant="elevated" hoverable clickable on:click={handler}>
  Interactive card
</Card>
```

#### Modal
Dialog with backdrop blur:

```svelte
<Modal bind:open={modalOpen} title="Settings" size="md">
  <p>Modal content</p>

  <div slot="footer" class="flex gap-2 justify-end">
    <Button variant="secondary" on:click={() => modalOpen = false}>
      Cancel
    </Button>
    <Button variant="primary">Save</Button>
  </div>
</Modal>
```

#### Dropdown
Context menus with Linear-style design:

```svelte
<Dropdown bind:open={dropdownOpen} align="end">
  <Button slot="trigger">Options</Button>

  <button class="dropdown-item">Edit</button>
  <button class="dropdown-item">Duplicate</button>
  <div class="dropdown-divider" />
  <button class="dropdown-item text-error">Delete</button>
</Dropdown>
```

#### Avatar
User avatars with status:

```svelte
<Avatar src={user.avatar} alt={user.name} size="md" status="online" />
<Avatar alt="John Doe" size="lg" />
```

Status options: `online`, `offline`, `away`
Sizes: `sm`, `md`, `lg`, `xl`

#### Badge
Status and category badges:

```svelte
<Badge variant="accent">New</Badge>
<Badge variant="success" dot>Active</Badge>
<Badge variant="memory">Important</Badge>
<Badge variant="warning" size="sm">Beta</Badge>
```

#### Tooltip
Contextual hints with positioning:

```svelte
<Tooltip text="Edit this note" position="top">
  <Button variant="ghost">Edit</Button>
</Tooltip>
```

Positions: `top`, `bottom`, `left`, `right`

#### CommandPalette
Global command search (Cmd+K):

```svelte
<CommandPalette
  bind:open={paletteOpen}
  commands={[
    {
      id: 'new-note',
      label: 'Create new note',
      icon: '📝',
      category: 'Actions',
      shortcut: ['⌘', 'N'],
      action: () => createNote()
    }
  ]}
/>
```

Features:
- Keyboard shortcut: `Cmd+K` / `Ctrl+K`
- Fuzzy search
- Grouped results by category
- Keyboard navigation
- Shortcut hints

### Layout Components

#### AppShell
Main application wrapper:

```svelte
<AppShell
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Notes' }
  ]}
  workspace={{ name: 'My Workspace', avatar: null }}
  user={{ name: 'John Doe', email: 'john@example.com' }}
>
  <div class="p-6">
    <!-- Page content -->
  </div>
</AppShell>
```

Includes:
- Collapsible sidebar
- Top header with breadcrumbs
- User menu
- Command palette integration

#### Sidebar
Collapsible navigation (240px → 56px):

Features:
- Workspace switcher
- Navigation items with badges
- Icon-only collapsed state
- Smooth transitions
- Quick actions (new note, settings)

#### Header
Top bar with breadcrumbs and actions:

Features:
- Breadcrumb navigation
- Search button (opens command palette)
- Notifications
- User dropdown menu

## Utilities

### cn() Helper
Merge Tailwind classes with proper precedence:

```typescript
import { cn } from '$lib/utils';

<div class={cn(
  'base-class',
  isActive && 'active-class',
  props.class
)} />
```

### formatRelativeTime()
Format dates relative to now:

```typescript
import { formatRelativeTime } from '$lib/utils';

formatRelativeTime(new Date('2024-01-15')) // "2 hours ago"
```

### getInitials()
Generate initials from names:

```typescript
import { getInitials } from '$lib/utils';

getInitials('John Doe') // "JD"
```

### stringToColor()
Generate stable colors from strings:

```typescript
import { stringToColor } from '$lib/utils';

stringToColor('user@example.com') // "#8b7cf6"
```

## Best Practices

### 1. Semantic HTML
Use proper HTML elements:
```svelte
<!-- Good -->
<button type="button" on:click={handler}>Click me</button>
<a href="/notes">View notes</a>

<!-- Bad -->
<div on:click={handler}>Click me</div>
<span on:click={() => goto('/notes')}>View notes</span>
```

### 2. Accessibility
- Always provide ARIA labels for icon buttons
- Use semantic landmarks (`<nav>`, `<main>`, `<aside>`)
- Test keyboard navigation
- Ensure sufficient color contrast

### 3. Component Composition
Leverage slots for flexibility:
```svelte
<Modal title="Settings">
  <SettingsForm />

  <div slot="footer">
    <Button variant="primary">Save</Button>
  </div>
</Modal>
```

### 4. Utility-First Styling
Use Tailwind utilities with the `cn()` helper:
```svelte
<script>
  import { cn } from '$lib/utils';
  export let variant = 'default';
</script>

<div class={cn(
  'base-class',
  variant === 'primary' && 'primary-class',
  variant === 'secondary' && 'secondary-class',
  $$props.class
)}>
  <slot />
</div>
```

### 5. Consistent Spacing
Use the spacing scale:
```svelte
<!-- Good -->
<div class="p-6 space-y-4">
  <h2 class="mb-2">Title</h2>
  <p>Content</p>
</div>

<!-- Bad -->
<div style="padding: 23px">
  <h2 style="margin-bottom: 7px">Title</h2>
  <p>Content</p>
</div>
```

## Design Tokens Reference

### CSS Variables
```css
/* Colors */
--canvas: #0c0c0e;
--ink: #f5f4f1;
--accent: #8b7cf6;
--memory: #f5a623;

/* Spacing */
--spacing-4: 1rem;
--spacing-6: 1.5rem;

/* Radius */
--radius-lg: 0.75rem;

/* Animation */
--duration-normal: 200ms;
--ease-out: cubic-bezier(0.165, 0.84, 0.44, 1);
```

### Tailwind Classes
```css
/* Colors */
bg-canvas-raised
text-ink-muted
border-border
bg-accent

/* Spacing */
p-6
space-y-4
gap-3

/* Radius */
rounded-lg

/* Shadows */
shadow-md
```

## Inspiration Credits

This design system draws inspiration from:

- **Linear**: Command palette, keyboard shortcuts, density, premium dark aesthetic
- **Notion**: Block-based editing, warm color palette, flexibility, emoji-first design
- **Craft**: Card-based layouts, native feel, Apple-like design sensibility
- **Obsidian**: Graph visualization, customization depth, power-user features

## Technical Stack

- **SvelteKit**: Full-stack framework
- **Svelte 5**: Component framework with runes
- **Tailwind CSS**: Utility-first CSS
- **TypeScript**: Type safety
- **clsx + tailwind-merge**: Class name utilities

---

*Last updated: January 2026*
