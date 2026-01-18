<script lang="ts">
  import AppShell from '$lib/components/layout/AppShell.svelte';
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

  let modalOpen = false;
  let dropdownOpen = false;
  let commandPaletteOpen = false;

  const breadcrumbs = [
    { label: 'Design System', href: '/design-system' }
  ];

  const workspace = {
    name: 'Design Demo',
    avatar: null
  };

  const user = {
    name: 'Jane Designer',
    email: 'jane@memento.app',
    avatar: null,
    status: 'online' as const
  };
</script>

<AppShell {breadcrumbs} {workspace} {user}>
  <div class="max-w-6xl mx-auto p-8 space-y-12">
    <!-- Header -->
    <div class="space-y-2">
      <h1 class="text-4xl font-semibold text-ink">Memento Design System</h1>
      <p class="text-lg text-ink-muted">
        A distinctive, premium component library for collaborative notes
      </p>
    </div>

    <!-- Color Palette -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold text-ink">Color Palette</h2>

      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-ink-muted mb-3">Canvas (Backgrounds)</h3>
          <div class="grid grid-cols-4 gap-3">
            <div class="space-y-2">
              <div class="h-20 rounded-lg bg-canvas border border-border" />
              <div class="text-xs">
                <div class="font-medium text-ink">Canvas</div>
                <div class="text-ink-faint">#0c0c0e</div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-20 rounded-lg bg-canvas-raised border border-border" />
              <div class="text-xs">
                <div class="font-medium text-ink">Raised</div>
                <div class="text-ink-faint">#141416</div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-20 rounded-lg bg-canvas-overlay border border-border" />
              <div class="text-xs">
                <div class="font-medium text-ink">Overlay</div>
                <div class="text-ink-faint">#1c1c1f</div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-20 rounded-lg bg-canvas-inset border border-border" />
              <div class="text-xs">
                <div class="font-medium text-ink">Inset</div>
                <div class="text-ink-faint">#08080a</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-medium text-ink-muted mb-3">Ink (Text)</h3>
          <div class="grid grid-cols-3 gap-3">
            <div class="space-y-2">
              <div class="h-20 rounded-lg bg-ink border border-border" />
              <div class="text-xs">
                <div class="font-medium text-ink">Ink</div>
                <div class="text-ink-faint">#f5f4f1</div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-20 rounded-lg bg-ink-muted border border-border" />
              <div class="text-xs">
                <div class="font-medium text-ink">Muted</div>
                <div class="text-ink-faint">#a8a5a0</div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-20 rounded-lg bg-ink-faint border border-border" />
              <div class="text-xs">
                <div class="font-medium text-ink">Faint</div>
                <div class="text-ink-faint">#6b6966</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-medium text-ink-muted mb-3">Accent Colors</h3>
          <div class="grid grid-cols-5 gap-3">
            <div class="space-y-2">
              <div class="h-20 rounded-lg bg-accent" />
              <div class="text-xs">
                <div class="font-medium text-ink">Accent</div>
                <div class="text-ink-faint">#8b7cf6</div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-20 rounded-lg bg-memory" />
              <div class="text-xs">
                <div class="font-medium text-ink">Memory</div>
                <div class="text-ink-faint">#f5a623</div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-20 rounded-lg bg-success" />
              <div class="text-xs">
                <div class="font-medium text-ink">Success</div>
                <div class="text-ink-faint">#4ade80</div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-20 rounded-lg bg-warning" />
              <div class="text-xs">
                <div class="font-medium text-ink">Warning</div>
                <div class="text-ink-faint">#fbbf24</div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-20 rounded-lg bg-error" />
              <div class="text-xs">
                <div class="font-medium text-ink">Error</div>
                <div class="text-ink-faint">#f87171</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Typography -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold text-ink">Typography</h2>

      <Card class="p-6 space-y-4">
        <div class="space-y-2">
          <h1 class="text-3xl">Heading 1 - The quick brown fox</h1>
          <p class="text-xs text-ink-muted">30px / 1.875rem · Font weight 590 · Letter spacing -0.02em</p>
        </div>

        <div class="space-y-2">
          <h2 class="text-2xl">Heading 2 - The quick brown fox</h2>
          <p class="text-xs text-ink-muted">24px / 1.5rem · Font weight 590 · Letter spacing -0.02em</p>
        </div>

        <div class="space-y-2">
          <h3 class="text-xl">Heading 3 - The quick brown fox</h3>
          <p class="text-xs text-ink-muted">20px / 1.25rem · Font weight 590 · Letter spacing -0.02em</p>
        </div>

        <div class="space-y-2">
          <p class="text-base">Body text - The quick brown fox jumps over the lazy dog</p>
          <p class="text-xs text-ink-muted">15px / 0.9375rem · Font weight 400 · Letter spacing -0.011em</p>
        </div>

        <div class="space-y-2">
          <p class="text-sm text-ink-muted">Small text - The quick brown fox</p>
          <p class="text-xs text-ink-muted">13px / 0.8125rem · Font weight 400</p>
        </div>

        <div class="space-y-2">
          <code class="font-mono text-sm bg-canvas-raised px-2 py-1 rounded">const greeting = 'Hello World';</code>
          <p class="text-xs text-ink-muted">JetBrains Mono · Monospace font</p>
        </div>
      </Card>
    </section>

    <!-- Buttons -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold text-ink">Buttons</h2>

      <Card class="p-6 space-y-6">
        <div class="space-y-3">
          <h3 class="text-sm font-medium text-ink-muted">Variants</h3>
          <div class="flex flex-wrap gap-3">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button loading>Loading...</Button>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-medium text-ink-muted">Sizes</h3>
          <div class="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-medium text-ink-muted">States</h3>
          <div class="flex flex-wrap gap-3">
            <Button variant="primary">Normal</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="secondary">Hover me</Button>
          </div>
        </div>
      </Card>
    </section>

    <!-- Inputs -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold text-ink">Inputs</h2>

      <Card class="p-6 space-y-4">
        <div class="max-w-md space-y-3">
          <Input placeholder="Default input" />
          <Input variant="search" placeholder="Search..." />
          <Input type="email" placeholder="Email" />
          <Input placeholder="Input with error" error="This field is required" />
          <Input disabled placeholder="Disabled input" />
        </div>
      </Card>
    </section>

    <!-- Cards -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold text-ink">Cards</h2>

      <div class="grid grid-cols-3 gap-4">
        <Card class="p-6">
          <h3 class="text-lg font-semibold mb-2">Default Card</h3>
          <p class="text-sm text-ink-muted">
            Standard card with raised background and border
          </p>
        </Card>

        <Card variant="elevated" class="p-6">
          <h3 class="text-lg font-semibold mb-2">Elevated Card</h3>
          <p class="text-sm text-ink-muted">
            Card with shadow for extra emphasis
          </p>
        </Card>

        <Card variant="bordered" hoverable clickable class="p-6">
          <h3 class="text-lg font-semibold mb-2">Interactive Card</h3>
          <p class="text-sm text-ink-muted">
            Hoverable and clickable card
          </p>
        </Card>
      </div>
    </section>

    <!-- Avatars -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold text-ink">Avatars</h2>

      <Card class="p-6 space-y-6">
        <div class="space-y-3">
          <h3 class="text-sm font-medium text-ink-muted">Sizes</h3>
          <div class="flex items-center gap-4">
            <Avatar alt="John Doe" size="sm" />
            <Avatar alt="Jane Smith" size="md" />
            <Avatar alt="Bob Wilson" size="lg" />
            <Avatar alt="Alice Brown" size="xl" />
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-medium text-ink-muted">Status Indicators</h3>
          <div class="flex items-center gap-4">
            <Avatar alt="Online User" size="md" status="online" />
            <Avatar alt="Away User" size="md" status="away" />
            <Avatar alt="Offline User" size="md" status="offline" />
          </div>
        </div>
      </Card>
    </section>

    <!-- Badges -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold text-ink">Badges</h2>

      <Card class="p-6 space-y-6">
        <div class="space-y-3">
          <h3 class="text-sm font-medium text-ink-muted">Variants</h3>
          <div class="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="memory">Memory</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-medium text-ink-muted">With Dot</h3>
          <div class="flex flex-wrap gap-3">
            <Badge variant="accent" dot>New</Badge>
            <Badge variant="success" dot>Active</Badge>
            <Badge variant="warning" dot>Pending</Badge>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-medium text-ink-muted">Sizes</h3>
          <div class="flex flex-wrap items-center gap-3">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
          </div>
        </div>
      </Card>
    </section>

    <!-- Tooltips -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold text-ink">Tooltips</h2>

      <Card class="p-6">
        <div class="flex flex-wrap gap-4">
          <Tooltip text="Tooltip on top" position="top">
            <Button variant="secondary">Hover (Top)</Button>
          </Tooltip>

          <Tooltip text="Tooltip on bottom" position="bottom">
            <Button variant="secondary">Hover (Bottom)</Button>
          </Tooltip>

          <Tooltip text="Tooltip on left" position="left">
            <Button variant="secondary">Hover (Left)</Button>
          </Tooltip>

          <Tooltip text="Tooltip on right" position="right">
            <Button variant="secondary">Hover (Right)</Button>
          </Tooltip>
        </div>
      </Card>
    </section>

    <!-- Dropdown -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold text-ink">Dropdown</h2>

      <Card class="p-6">
        <Dropdown bind:open={dropdownOpen} align="start">
          <Button variant="secondary" slot="trigger">
            Open Menu
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </Button>

          <button type="button" class="dropdown-item w-full">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>

          <button type="button" class="dropdown-item w-full">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Duplicate
          </button>

          <div class="dropdown-divider" />

          <button type="button" class="dropdown-item w-full text-error">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </Dropdown>
      </Card>
    </section>

    <!-- Modal -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold text-ink">Modal</h2>

      <Card class="p-6">
        <Button variant="primary" on:click={() => (modalOpen = true)}>
          Open Modal
        </Button>
      </Card>

      <Modal bind:open={modalOpen} title="Example Modal" size="md">
        <div class="space-y-4">
          <p class="text-ink-muted">
            This is a modal with backdrop blur. It includes a header, body, and footer section.
          </p>

          <Input placeholder="Enter something..." />

          <p class="text-sm text-ink-faint">
            Press ESC to close or click outside the modal.
          </p>
        </div>

        <div slot="footer" class="flex gap-2 justify-end">
          <Button variant="secondary" on:click={() => (modalOpen = false)}>
            Cancel
          </Button>
          <Button variant="primary" on:click={() => (modalOpen = false)}>
            Save Changes
          </Button>
        </div>
      </Modal>
    </section>

    <!-- Command Palette -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold text-ink">Command Palette</h2>

      <Card class="p-6 space-y-4">
        <p class="text-ink-muted">
          Press <kbd class="px-2 py-1 text-xs bg-canvas-raised border border-border rounded">⌘K</kbd>
          or <kbd class="px-2 py-1 text-xs bg-canvas-raised border border-border rounded">Ctrl+K</kbd>
          to open the command palette from anywhere.
        </p>

        <Button variant="secondary" on:click={() => (commandPaletteOpen = true)}>
          Open Command Palette
        </Button>
      </Card>
    </section>
  </div>
</AppShell>
