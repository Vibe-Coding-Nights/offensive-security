# Memento Design System - Quick Reference

One-page cheat sheet for developers.

## 🎨 Colors

```css
/* Backgrounds */
bg-canvas          /* #0c0c0e - main */
bg-canvas-raised   /* #141416 - cards */
bg-canvas-overlay  /* #1c1c1f - modals */

/* Text */
text-ink           /* #f5f4f1 - primary */
text-ink-muted     /* #a8a5a0 - secondary */
text-ink-faint     /* #6b6966 - tertiary */

/* Accents */
bg-accent          /* #8b7cf6 - violet */
bg-memory          /* #f5a623 - amber */
bg-success         /* #4ade80 - green */
bg-warning         /* #fbbf24 - yellow */
bg-error           /* #f87171 - red */

/* Borders */
border-border      /* #262628 */
```

## 📏 Spacing

```css
/* Tailwind classes */
p-2   /* 8px */
p-4   /* 16px */
p-6   /* 24px */
p-8   /* 32px */

gap-2, gap-3, gap-4, gap-6
space-y-2, space-y-4, space-y-6
```

## 🔤 Typography

```css
/* Sizes */
text-xs    /* 12px */
text-sm    /* 13px */
text-base  /* 15px - default body */
text-lg    /* 18px */
text-xl    /* 20px - h3 */
text-2xl   /* 24px - h2 */
text-3xl   /* 30px - h1 */

/* Weights */
font-medium   /* 510 */
font-semibold /* 590 */
```

## 🧩 Component Imports

```typescript
// UI Components
import {
  Avatar,
  Badge,
  Button,
  Card,
  CommandPalette,
  Dropdown,
  Input,
  Modal,
  Tooltip
} from '$lib/components/ui';

// Layout
import { AppShell, Header, Sidebar } from '$lib/components/layout';

// Utils
import { cn } from '$lib/utils';
```

## 🔘 Buttons

```svelte
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">More</Button>
<Button variant="danger">Delete</Button>

<Button size="sm|md|lg">Size</Button>
<Button loading>Saving...</Button>
<Button disabled>Disabled</Button>
```

## 📝 Inputs

```svelte
<Input bind:value={text} placeholder="Enter text..." />
<Input variant="search" placeholder="Search..." />
<Input error="Error message" />
<Input type="email|password|search" />
```

## 🗂️ Cards

```svelte
<Card class="p-6">Basic card</Card>
<Card variant="elevated">With shadow</Card>
<Card hoverable clickable on:click={handler}>Interactive</Card>
```

## 🪟 Modals

```svelte
<Modal bind:open={isOpen} title="Modal Title" size="sm|md|lg|xl">
  Content

  <div slot="footer">
    <Button>Action</Button>
  </div>
</Modal>
```

## 📌 Badges

```svelte
<Badge variant="accent">New</Badge>
<Badge variant="success" dot>Active</Badge>
<Badge size="sm">Small</Badge>
```

## 👤 Avatars

```svelte
<Avatar alt="John Doe" size="sm|md|lg|xl" />
<Avatar src="/avatar.jpg" status="online|away|offline" />
```

## 💬 Tooltips

```svelte
<Tooltip text="Hint text" position="top|bottom|left|right">
  <Button>Hover me</Button>
</Tooltip>
```

## 📋 Dropdowns

```svelte
<Dropdown align="start|center|end">
  <Button slot="trigger">Menu</Button>

  <button class="dropdown-item">Edit</button>
  <div class="dropdown-divider" />
  <button class="dropdown-item text-error">Delete</button>
</Dropdown>
```

## ⌨️ Command Palette

```svelte
<CommandPalette
  bind:open={commandOpen}
  commands={[
    {
      id: 'action',
      label: 'Do something',
      icon: '🎯',
      category: 'Actions',
      shortcut: ['⌘', 'K'],
      action: () => {}
    }
  ]}
/>
```
Keyboard: `Cmd+K` or `Ctrl+K`

## 🏗️ Layout

```svelte
<AppShell
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Page' }
  ]}
  workspace={{ name: 'Workspace', avatar: null }}
  user={{ name: 'User', email: 'user@example.com' }}
>
  <div class="max-w-4xl mx-auto p-8">
    <!-- Page content -->
  </div>
</AppShell>
```

## 🛠️ Common Patterns

### Loading State
```svelte
{#if loading}
  <div class="flex items-center justify-center h-64">
    <div class="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
  </div>
{:else}
  <Card>Content</Card>
{/if}
```

### Empty State
```svelte
<Card class="p-12 text-center">
  <h3 class="text-lg font-semibold mb-2">No items</h3>
  <p class="text-ink-muted mb-4">Get started by creating one</p>
  <Button>Create</Button>
</Card>
```

### Form
```svelte
<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  <Input bind:value={data.field} error={errors.field} />
  <div class="flex gap-2 justify-end">
    <Button variant="secondary">Cancel</Button>
    <Button type="submit" loading={saving}>Save</Button>
  </div>
</form>
```

### Grid Layout
```svelte
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {#each items as item}
    <Card class="p-4">{item.name}</Card>
  {/each}
</div>
```

## 🎯 Utility Functions

```typescript
import { cn, formatRelativeTime, getInitials, stringToColor } from '$lib/utils';

// Merge classes
cn('base-class', condition && 'conditional-class', props.class)

// Format dates
formatRelativeTime(new Date()) // "2 hours ago"

// Get initials
getInitials('John Doe') // "JD"

// Generate color
stringToColor('user@example.com') // "#8b7cf6"
```

## 🎨 Custom Styling

```svelte
<script>
  import { cn } from '$lib/utils';
  export let variant = 'default';
</script>

<div class={cn(
  'base-class p-4',
  variant === 'primary' && 'bg-accent',
  variant === 'secondary' && 'bg-canvas-raised',
  $$props.class
)}>
  <slot />
</div>
```

## 🔑 Keyboard Shortcuts

- `Cmd+K` / `Ctrl+K` - Command palette
- `Escape` - Close modals/dropdowns
- `↑↓` - Navigate command palette
- `Enter` - Select/submit

## ✅ Best Practices

1. **Always use semantic HTML**
   ```svelte
   <!-- Good -->
   <button>Click</button>
   <a href="/page">Link</a>

   <!-- Bad -->
   <div on:click>Click</div>
   ```

2. **Provide ARIA labels for icon buttons**
   ```svelte
   <Button aria-label="Edit note">
     <svg>...</svg>
   </Button>
   ```

3. **Use slots for flexibility**
   ```svelte
   <Modal>
     Content
     <div slot="footer">Actions</div>
   </Modal>
   ```

4. **Merge classes with cn()**
   ```svelte
   <div class={cn('base', condition && 'extra', $$props.class)} />
   ```

5. **Respect reduced motion**
   - All animations automatically respect `prefers-reduced-motion`

## 📱 Responsive Design

```css
/* Tailwind breakpoints */
sm:   /* 640px */
md:   /* 768px */
lg:   /* 1024px */
xl:   /* 1280px */
2xl:  /* 1536px */

/* Usage */
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## 🌈 Color Variables (CSS)

```css
/* Use in custom CSS */
background: var(--canvas-raised);
color: var(--ink);
border-color: var(--border);
border-radius: var(--radius-lg);
transition-duration: var(--duration-normal);
```

## 📦 File Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/           # UI components
│   │   └── layout/       # Layout components
│   └── utils.ts          # Utilities
├── routes/
│   └── design-system/    # Component demo
└── app.css               # Global styles
```

## 🚀 Quick Start Template

```svelte
<script lang="ts">
  import AppShell from '$lib/components/layout/AppShell.svelte';
  import { Button, Card, Input } from '$lib/components/ui';

  let data = '';
</script>

<AppShell breadcrumbs={[{ label: 'Page' }]}>
  <div class="max-w-4xl mx-auto p-8 space-y-6">
    <h1>Page Title</h1>

    <Card class="p-6">
      <Input bind:value={data} placeholder="Enter text..." />
      <Button variant="primary" class="mt-4">Submit</Button>
    </Card>
  </div>
</AppShell>
```

---

**View full documentation**: `/design/DESIGN_SYSTEM.md`
**View examples**: `/design/COMPONENT_EXAMPLES.md`
**View demo**: `/design-system` route
