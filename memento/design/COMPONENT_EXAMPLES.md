# Component Examples

Quick reference for common component patterns in Memento.

## Import Components

```typescript
// Individual imports
import { Button, Input, Card } from '$lib/components/ui';
import { AppShell, Sidebar, Header } from '$lib/components/layout';

// Utility functions
import { cn, formatRelativeTime, getInitials } from '$lib/utils';
```

## Button Examples

### Basic Usage
```svelte
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Options</Button>
<Button variant="danger">Delete</Button>
```

### With Loading State
```svelte
<script>
  let saving = false;

  async function handleSave() {
    saving = true;
    await saveNote();
    saving = false;
  }
</script>

<Button variant="primary" loading={saving} on:click={handleSave}>
  Save Note
</Button>
```

### Different Sizes
```svelte
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
```

### With Icons
```svelte
<Button variant="primary">
  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
  </svg>
  New Note
</Button>
```

## Input Examples

### Text Input
```svelte
<script>
  let title = '';
</script>

<Input
  bind:value={title}
  placeholder="Enter note title..."
  on:input={() => console.log('Input changed:', title)}
/>
```

### Search Input
```svelte
<script>
  let query = '';

  function handleSearch() {
    console.log('Searching for:', query);
  }
</script>

<Input
  variant="search"
  bind:value={query}
  placeholder="Search notes..."
  on:change={handleSearch}
/>
```

### With Validation
```svelte
<script>
  let email = '';
  let error = '';

  function validateEmail() {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    error = isValid ? '' : 'Please enter a valid email';
  }
</script>

<Input
  type="email"
  bind:value={email}
  placeholder="you@example.com"
  {error}
  on:blur={validateEmail}
/>
```

## Card Examples

### Basic Card
```svelte
<Card class="p-6">
  <h3 class="text-lg font-semibold mb-2">Card Title</h3>
  <p class="text-ink-muted">Card content goes here</p>
</Card>
```

### Clickable Card
```svelte
<Card
  variant="elevated"
  hoverable
  clickable
  on:click={() => goto('/notes/123')}
  class="p-6"
>
  <h3 class="text-lg font-semibold">Meeting Notes</h3>
  <p class="text-sm text-ink-muted">Last edited 2 hours ago</p>
</Card>
```

### Card Grid
```svelte
<div class="grid grid-cols-3 gap-4">
  {#each notes as note}
    <Card hoverable clickable class="p-4">
      <h4 class="font-medium">{note.title}</h4>
      <p class="text-sm text-ink-muted mt-1">{note.preview}</p>
      <Badge variant="memory" size="sm" class="mt-3">{note.category}</Badge>
    </Card>
  {/each}
</div>
```

## Modal Examples

### Basic Modal
```svelte
<script>
  let open = false;
</script>

<Button on:click={() => (open = true)}>Open Settings</Button>

<Modal bind:open title="Settings" size="md">
  <div class="space-y-4">
    <Input placeholder="Your name" />
    <Input type="email" placeholder="Email" />
  </div>

  <div slot="footer" class="flex gap-2 justify-end">
    <Button variant="secondary" on:click={() => (open = false)}>Cancel</Button>
    <Button variant="primary">Save</Button>
  </div>
</Modal>
```

### Confirmation Dialog
```svelte
<script>
  let confirmDelete = false;

  function handleDelete() {
    // Delete logic
    confirmDelete = false;
  }
</script>

<Modal bind:open={confirmDelete} title="Delete Note?" size="sm">
  <p class="text-ink-muted">
    Are you sure you want to delete this note? This action cannot be undone.
  </p>

  <div slot="footer" class="flex gap-2 justify-end">
    <Button variant="secondary" on:click={() => (confirmDelete = false)}>
      Cancel
    </Button>
    <Button variant="danger" on:click={handleDelete}>
      Delete
    </Button>
  </div>
</Modal>
```

### Custom Header Modal
```svelte
<Modal bind:open size="lg">
  <div slot="header" class="flex items-center gap-3">
    <Avatar alt="User" size="md" />
    <div>
      <h2 class="font-semibold">User Profile</h2>
      <p class="text-sm text-ink-muted">Manage your account</p>
    </div>
  </div>

  <div class="space-y-4">
    <!-- Profile form -->
  </div>
</Modal>
```

## Dropdown Examples

### Context Menu
```svelte
<script>
  let menuOpen = false;
</script>

<Dropdown bind:open={menuOpen}>
  <Button variant="ghost" slot="trigger">
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  </Button>

  <button class="dropdown-item">Edit</button>
  <button class="dropdown-item">Share</button>
  <button class="dropdown-item">Duplicate</button>
  <div class="dropdown-divider" />
  <button class="dropdown-item text-error">Delete</button>
</Dropdown>
```

### User Menu
```svelte
<Dropdown align="end">
  <div slot="trigger" class="flex items-center gap-2 cursor-pointer">
    <Avatar alt={user.name} size="sm" status={user.status} />
  </div>

  <div class="min-w-[200px]">
    <div class="px-3 py-2 border-b border-border">
      <p class="font-medium text-ink">{user.name}</p>
      <p class="text-xs text-ink-muted">{user.email}</p>
    </div>

    <button class="dropdown-item">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      Profile
    </button>

    <button class="dropdown-item">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Settings
    </button>

    <div class="dropdown-divider" />

    <button class="dropdown-item text-error">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Log out
    </button>
  </div>
</Dropdown>
```

## Avatar Examples

### User Avatar
```svelte
<Avatar
  src={user.avatar}
  alt={user.name}
  size="md"
  status="online"
/>
```

### Avatar Group
```svelte
<div class="flex -space-x-2">
  {#each collaborators as user}
    <Avatar
      src={user.avatar}
      alt={user.name}
      size="sm"
      class="border-2 border-canvas"
    />
  {/each}
</div>
```

### Initials Fallback
```svelte
<!-- Automatically generates initials and color -->
<Avatar alt="John Doe" size="lg" />
```

## Badge Examples

### Status Badges
```svelte
<Badge variant="success" dot>Published</Badge>
<Badge variant="warning" dot>Draft</Badge>
<Badge variant="error" dot>Archived</Badge>
```

### Category Tags
```svelte
<div class="flex gap-2">
  <Badge variant="accent">Design</Badge>
  <Badge variant="memory">Important</Badge>
  <Badge variant="default">Personal</Badge>
</div>
```

### Count Badges
```svelte
<div class="flex items-center gap-2">
  <span class="text-ink-muted">Notifications</span>
  <Badge variant="accent">3</Badge>
</div>
```

## Tooltip Examples

### Icon Button with Tooltip
```svelte
<Tooltip text="Edit note" position="top">
  <Button variant="ghost" size="sm">
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  </Button>
</Tooltip>
```

### Delayed Tooltip
```svelte
<Tooltip text="This appears after 1 second" position="bottom" delay={1000}>
  <span class="text-ink-muted cursor-help">Hover me</span>
</Tooltip>
```

## Command Palette Example

### Full Implementation
```svelte
<script>
  import { goto } from '$app/navigation';

  let commandPaletteOpen = false;

  const commands = [
    {
      id: 'new-note',
      label: 'Create new note',
      icon: '📝',
      category: 'Actions',
      shortcut: ['⌘', 'N'],
      action: () => goto('/notes/new')
    },
    {
      id: 'search',
      label: 'Search all notes',
      icon: '🔍',
      category: 'Actions',
      shortcut: ['⌘', 'F'],
      action: () => {
        // Open search
      }
    },
    {
      id: 'inbox',
      label: 'Go to Inbox',
      icon: '📥',
      category: 'Navigation',
      shortcut: ['G', 'I'],
      action: () => goto('/inbox')
    },
    {
      id: 'settings',
      label: 'Open settings',
      icon: '⚙️',
      category: 'Actions',
      shortcut: ['⌘', ','],
      action: () => goto('/settings')
    }
  ];
</script>

<CommandPalette bind:open={commandPaletteOpen} {commands} />
```

## AppShell Example

### Complete App Layout
```svelte
<script>
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Current Project' }
  ];

  const workspace = {
    name: 'My Workspace',
    avatar: null
  };

  const user = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatar: null,
    status: 'online' as const
  };
</script>

<AppShell {breadcrumbs} {workspace} {user}>
  <div class="max-w-4xl mx-auto p-8">
    <h1>Page Content</h1>
    <!-- Your page content -->
  </div>
</AppShell>
```

## Common Patterns

### Loading State
```svelte
<script>
  let loading = true;
  let data = null;

  onMount(async () => {
    data = await fetchData();
    loading = false;
  });
</script>

{#if loading}
  <div class="flex items-center justify-center h-64">
    <div class="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
  </div>
{:else}
  <Card class="p-6">
    <!-- Content -->
  </Card>
{/if}
```

### Empty State
```svelte
<Card class="p-12 text-center">
  <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-canvas-overlay flex items-center justify-center">
    <svg class="w-8 h-8 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  </div>
  <h3 class="text-lg font-semibold mb-2">No notes yet</h3>
  <p class="text-ink-muted mb-4">Create your first note to get started</p>
  <Button variant="primary">Create Note</Button>
</Card>
```

### Form Example
```svelte
<script>
  let formData = {
    title: '',
    description: '',
    category: ''
  };

  let errors = {};
  let saving = false;

  async function handleSubmit() {
    // Validate
    errors = {};
    if (!formData.title) errors.title = 'Title is required';

    if (Object.keys(errors).length > 0) return;

    // Save
    saving = true;
    await saveNote(formData);
    saving = false;
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  <div>
    <label for="title" class="block text-sm font-medium mb-2">Title</label>
    <Input
      id="title"
      bind:value={formData.title}
      error={errors.title}
      placeholder="Enter title..."
    />
  </div>

  <div>
    <label for="description" class="block text-sm font-medium mb-2">Description</label>
    <Input
      id="description"
      bind:value={formData.description}
      placeholder="Enter description..."
    />
  </div>

  <div class="flex gap-2 justify-end">
    <Button variant="secondary" type="button">Cancel</Button>
    <Button variant="primary" type="submit" loading={saving}>
      Save Note
    </Button>
  </div>
</form>
```

## Utility Class Examples

### Using cn() Helper
```svelte
<script>
  import { cn } from '$lib/utils';

  export let variant = 'default';
  export let active = false;
</script>

<div class={cn(
  'base-class p-4 rounded-lg',
  variant === 'primary' && 'bg-accent text-white',
  variant === 'secondary' && 'bg-canvas-raised',
  active && 'border-2 border-accent',
  $$props.class
)}>
  <slot />
</div>
```

### Responsive Design
```svelte
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {#each items as item}
    <Card class="p-4">
      <!-- Item content -->
    </Card>
  {/each}
</div>
```
