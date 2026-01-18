# Memento Product Design Document
## A Collaborative Notes App with AI Memory

**Version**: 1.0
**Last Updated**: January 2026
**Design Philosophy**: Calm productivity through ambient intelligence

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Information Architecture](#information-architecture)
3. [Page Specifications](#page-specifications)
4. [Editor Component](#editor-component)
5. [AI Chat UX](#ai-chat-ux)
6. [Component Library](#component-library)
7. [Design Tokens](#design-tokens)
8. [Micro-interactions](#micro-interactions)
9. [Responsive Strategy](#responsive-strategy)
10. [Accessibility](#accessibility)

---

## Design Principles

### Core Philosophy

Memento operates on the principle that **memory creates trust**. Unlike ephemeral AI chat interfaces, Memento's AI becomes more valuable over time. This creates a unique design challenge: making memory visible and controllable without becoming surveillance-like.

### Guiding Principles

1. **Calm Over Clever**
   - Avoid novelty for its own sake
   - Reduce cognitive load at every decision point
   - Use motion purposefully, never decoratively

2. **Transparency Without Overwhelm**
   - Users can always see what the AI knows
   - Memory is opt-out, never surprising
   - Source attribution builds trust

3. **Progressive Disclosure**
   - Simple interfaces by default
   - Power features reveal on intent
   - Expert users feel no ceiling

4. **Writing First**
   - The editor is the hero
   - AI assists, never interrupts
   - Formatting serves clarity

5. **Memory as Material**
   - Treat memories like objects users can hold
   - Make connections visible and navigable
   - Allow pruning, editing, and shaping

---

## Information Architecture

### Application Hierarchy

```
Memento
├── Home (Dashboard)
│   ├── Recent Notes
│   ├── Quick Capture
│   └── AI Conversation Starter
│
├── Workspaces
│   ├── Personal
│   │   ├── Notes
│   │   ├── Folders
│   │   └── Tags
│   ├── Team Workspace
│   │   ├── Shared Notes
│   │   ├── Team Members
│   │   └── Activity Feed
│   └── [Additional Workspaces]
│
├── AI Panel (Global Overlay)
│   ├── Chat Interface
│   ├── Memory Browser
│   └── Context Indicators
│
├── Search (Global)
│   ├── Notes Search
│   ├── Memory Search
│   └── Conversation History
│
├── Imports
│   ├── Import Queue
│   ├── Source Connections
│   └── Processing Status
│
└── Settings
    ├── Account
    ├── Workspaces
    ├── AI & Memory
    ├── Collaboration
    └── Integrations
```

### Navigation Model

**Primary Navigation (Left Sidebar)**
- Fixed position, collapsible to icons only
- Width: 240px expanded, 56px collapsed
- Contains: Workspaces, global actions, user menu

**Secondary Navigation (Context-dependent)**
- Appears within workspace views
- Shows folders, notes list, tags
- Width: 280px, hideable

**Tertiary Navigation (In-document)**
- Table of contents for long notes
- Breadcrumb trail for nested folders
- Back-links panel (notes that reference current note)

### URL Structure

```
/                           → Home/Dashboard
/workspace/:id              → Workspace overview
/workspace/:id/note/:noteId → Note editor
/workspace/:id/settings     → Workspace settings
/ai                         → Full-screen AI chat
/search?q=:query            → Search results
/settings                   → User settings
/memory                     → Memory browser (full view)
```

### Workspace Model

Workspaces are the primary organizational unit. Each workspace contains:

- **Notes**: Individual documents
- **Folders**: Optional hierarchy (max 3 levels recommended)
- **Tags**: Flat, workspace-scoped labels
- **Members**: For shared workspaces
- **AI Context**: Workspace-specific memory pool

**Personal vs. Shared Workspaces**:
- Personal workspaces are private by default
- Shared workspaces require explicit invitation
- AI memory for shared workspaces is visible to all members

---

## Page Specifications

### 1. Home / Dashboard

**Purpose**: Orient users, enable quick capture, surface recent work

**Layout**: Single-column, centered content (max-width: 720px)

**Sections**:

```
┌──────────────────────────────────────────────────────────────┐
│  [Logo]                                    [Search] [Avatar] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Good morning, Sarah                                         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Start writing...                           [New Note] │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────┐  ┌────────────────────────────────┐│
│  │  ASK MEMENTO        │  │  RECENT NOTES                  ││
│  │  ───────────────    │  │  ─────────────                 ││
│  │  "What were we      │  │  • API Design Doc    2h ago   ││
│  │   discussing about  │  │  • Team Standup      Yesterday ││
│  │   the new feature?" │  │  • Research Notes    Jan 14   ││
│  │                     │  │  • Project Roadmap   Jan 12   ││
│  │  [Ask AI →]         │  │                                ││
│  └─────────────────────┘  └────────────────────────────────┘│
│                                                              │
│  WORKSPACES                                                  │
│  ───────────────────────────────────────────────────────────│
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Personal │  │ Work     │  │ Research │  │ + New    │    │
│  │ 24 notes │  │ 156 notes│  │ 43 notes │  │          │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Interactions**:
- Quick capture field auto-saves to "Inbox" in personal workspace
- "Ask Memento" opens AI panel with pre-filled prompt
- Recent notes show hover preview on desktop
- Workspace cards show memory indicator (dot color = memory richness)

---

### 2. Workspace Overview

**Purpose**: Navigate notes, understand workspace structure, manage organization

**Layout**: Three-column (sidebar + notes list + preview)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [←]  Work Workspace                              [Share] [Settings] [AI] │
├──────────┬─────────────────────────┬───────────────────────────────────────┤
│          │                         │                                       │
│ FOLDERS  │ NOTES                   │ PREVIEW                               │
│ ──────── │ ─────                   │ ────────                              │
│ ▼ Design │ ┌───────────────────┐   │ API Design Document                   │
│   └ UX   │ │ API Design Doc    │◄──│ ═══════════════════                   │
│   └ UI   │ │ Updated 2h ago    │   │                                       │
│ ▼ Eng    │ │ #api #technical   │   │ Overview                              │
│   └ API  │ └───────────────────┘   │ ────────                              │
│   └ FE   │ ┌───────────────────┐   │ This document outlines our approach   │
│ ▼ Planning│ │ Team Standup     │   │ to the REST API redesign, focusing    │
│          │ │ Yesterday         │   │ on backwards compatibility...          │
│ ──────── │ │ #meeting          │   │                                       │
│ TAGS     │ └───────────────────┘   │ ┌─────────────────────────────────┐   │
│ ──────── │ ┌───────────────────┐   │ │ AI remembers 12 related items   │   │
│ #api (8) │ │ Research Notes    │   │ │ from this workspace             │   │
│ #meeting │ │ Jan 14            │   │ └─────────────────────────────────┘   │
│ #tech    │ │ #research         │   │                                       │
│          │ └───────────────────┘   │ [Open] [Share] [Move] [Delete]        │
│          │                         │                                       │
│ [+ Folder]│ [+ New Note]           │                                       │
└──────────┴─────────────────────────┴───────────────────────────────────────┘
```

**Notes List Behavior**:
- Default sort: Last modified (customizable)
- Search filters to matching notes in real-time
- Multi-select for bulk actions (move, tag, delete)
- Drag-drop to reorder or move to folders

**Preview Panel**:
- Shows rendered markdown
- Memory indicator shows AI context relevance
- Quick actions without opening full editor

---

### 3. Note Editor View

**Purpose**: Primary writing environment, the heart of Memento

**Layout**: Full-width editor with collapsible panels

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [←] Work / Design / UX                           [Share] [···] [AI ◉]   │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                    API Design Document                                     │
│                    ════════════════════                                    │
│                                                                            │
│     Overview                                                               │
│     ────────                                                               │
│     This document outlines our approach to the REST API redesign,          │
│     focusing on backwards compatibility while introducing new              │
│     capabilities for real-time collaboration.                              │
│                                                                            │
│     Key Decisions                                                          │
│     ─────────────                                                          │
│     1. **WebSocket for real-time**: We'll maintain REST for CRUD           │
│        but add WebSocket channels for live updates.                        │
│                                                                            │
│     2. **Versioning strategy**: URL-based versioning (/v2/)                │
│        with deprecation headers.                                           │
│                                                                            │
│     > **AI Memory**: This connects to your earlier discussion about        │
│     > [[Authentication Redesign]] from last Tuesday.                       │
│                                                                            │
│     ┌─────────────────────────────────────────────────────────────┐       │
│     │ /slash command suggestions appear here                       │       │
│     │   /heading   Insert heading                                  │       │
│     │   /code      Insert code block                               │       │
│     │   /image     Insert image                                    │       │
│     │   /ai        Ask AI about this note                          │       │
│     └─────────────────────────────────────────────────────────────┘       │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│  Updated 2 hours ago by you  •  3 comments  •  12 memories                │
└────────────────────────────────────────────────────────────────────────────┘
```

**Editor States**:

1. **Focus Mode**: Hide all chrome, just title + content
2. **Standard Mode**: Breadcrumb, toolbar accessible on hover
3. **Collaboration Mode**: Show presence indicators, comments sidebar
4. **AI Mode**: Split view with AI panel open

**Key Elements**:
- Title is inline-editable, large (32px)
- Body uses proportional serif for reading comfort
- Toolbar appears on text selection (floating)
- Slash commands for block insertion
- `[[` triggers note linking autocomplete
- `@` triggers mention in shared workspaces

---

### 4. AI Chat Interface

**Purpose**: Conversational AI that remembers and references your notes

**Layout Options**:
- **Panel Mode**: Slides in from right (400px width)
- **Split Mode**: 50/50 with current note
- **Full Mode**: Dedicated page at `/ai`

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Note Editor (50%)                    │  AI Assistant (50%)                │
├───────────────────────────────────────┼────────────────────────────────────┤
│                                       │                                    │
│  [Note content...]                    │  ┌──────────────────────────────┐  │
│                                       │  │ CONTEXT                      │  │
│                                       │  │ ○ API Design Doc (current)   │  │
│                                       │  │ ○ Work Workspace (12 notes)  │  │
│                                       │  │ ○ 3 past conversations       │  │
│                                       │  │ [Manage Context →]           │  │
│                                       │  └──────────────────────────────┘  │
│                                       │                                    │
│                                       │  ┌──────────────────────────────┐  │
│                                       │  │ You, 2 min ago               │  │
│                                       │  │ What did we decide about     │  │
│                                       │  │ WebSocket authentication?    │  │
│                                       │  └──────────────────────────────┘  │
│                                       │                                    │
│                                       │  ┌──────────────────────────────┐  │
│                                       │  │ Memento                      │  │
│                                       │  │                              │  │
│                                       │  │ Based on your discussion in  │  │
│                                       │  │ [Auth Redesign↗] from Jan 12,│  │
│                                       │  │ you decided to use JWT with  │  │
│                                       │  │ refresh token rotation.      │  │
│                                       │  │                              │  │
│                                       │  │ ┌────────────────────────┐   │  │
│                                       │  │ │ 🧠 High confidence      │   │  │
│                                       │  │ │ Source: Auth Redesign  │   │  │
│                                       │  │ └────────────────────────┘   │  │
│                                       │  └──────────────────────────────┘  │
│                                       │                                    │
│                                       │  ┌──────────────────────────────┐  │
│                                       │  │ Ask anything...        [↑]  │  │
│                                       │  └──────────────────────────────┘  │
└───────────────────────────────────────┴────────────────────────────────────┘
```

**Context Panel (Collapsible Header)**:
- Shows what AI currently "knows" about
- Current note indicator
- Active workspace scope
- Relevant past conversations
- "Manage Context" expands to memory browser

**Message Types**:

1. **User Message**
   - Right-aligned (subtle background)
   - Shows timestamp on hover
   - Can reference notes with `[[` syntax

2. **AI Response**
   - Left-aligned (card style)
   - Streaming text with subtle fade-in
   - Inline citations as clickable pills
   - Confidence indicator when referencing memory

3. **Memory Reference**
   - Quoted block style
   - Links to source note/conversation
   - Shows date of original content

4. **System Message**
   - Centered, muted text
   - For context changes, errors

**Confidence Indicators**:

```
┌───────────────────────────────────────┐
│ 🧠 High confidence                    │  ← Direct quote from your notes
│    Source: API Design Doc, Jan 14    │
└───────────────────────────────────────┘

┌───────────────────────────────────────┐
│ 💭 Inferred                           │  ← AI inference from patterns
│    Based on: 3 related discussions   │
└───────────────────────────────────────┘

┌───────────────────────────────────────┐
│ ⚡ General knowledge                  │  ← Not from your notes
│    Not from your Memento             │
└───────────────────────────────────────┘
```

---

### 5. Memory Panel / Context Browser

**Purpose**: Transparency into what AI knows, ability to manage memories

**Access Points**:
- "Manage Context" from AI chat
- Global navigation: `/memory`
- Note sidebar: "Related Memories"

**Layout**:

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Memory Browser                                           [Settings] [?]  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Your Memento contains 847 memories across 4 workspaces                   │
│                                                                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │ FILTER           │  │ WORKSPACE        │  │ TIME RANGE       │         │
│  │ All Memories  ▼  │  │ All           ▼  │  │ All Time      ▼  │         │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘         │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │  Search memories...                                                 │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  TODAY                                                                     │
│  ─────                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ ○ "WebSocket authentication will use JWT refresh rotation"          │  │
│  │   Source: API Design Doc  •  Confidence: High  •  2 hours ago       │  │
│  │                                                  [View] [Forget ✕]  │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ ○ "Team prefers weekly standups over daily"                         │  │
│  │   Source: Team Standup  •  Confidence: High  •  Yesterday           │  │
│  │                                                  [View] [Forget ✕]  │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  LAST WEEK                                                                 │
│  ─────────                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ ○ "API versioning strategy: URL-based with /v2/ prefix"             │  │
│  │   Source: API Design Doc  •  Confidence: High  •  Jan 14            │  │
│  │                                                  [View] [Forget ✕]  │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  [Load More...]                                                            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

**Memory Types**:
- **Facts**: Explicit statements from notes
- **Decisions**: Identified choice-points
- **Preferences**: User patterns and tendencies
- **Relationships**: Connections between concepts
- **Conversations**: Key points from AI chats

**Memory Actions**:
- **View**: Jump to source note/conversation
- **Forget**: Remove from AI memory (with confirmation)
- **Edit**: Correct or clarify a memory
- **Connect**: Manually link related memories

---

### 6. Settings and Preferences

**Structure**:

```
Settings
├── Account
│   ├── Profile (name, avatar, email)
│   ├── Password & Security
│   └── Connected Accounts
│
├── Appearance
│   ├── Theme (Light / Dark / System)
│   ├── Accent Color
│   ├── Editor Font
│   └── Density (Comfortable / Compact)
│
├── Editor
│   ├── Default View (Standard / Focus)
│   ├── Spellcheck
│   ├── Autocomplete behavior
│   └── Keyboard Shortcuts
│
├── AI & Memory
│   ├── Memory Scope (All / Per-Workspace)
│   ├── Auto-Memory (On / Ask / Off)
│   ├── Confidence Threshold
│   ├── Memory Retention Period
│   └── Export Memories
│
├── Workspaces
│   ├── [List of workspaces]
│   └── Default Workspace
│
├── Collaboration
│   ├── Notification Preferences
│   ├── Presence Settings
│   └── Comment Behavior
│
├── Integrations
│   ├── Notion (Connect / Disconnect)
│   ├── Google Docs
│   ├── GitHub
│   └── API Access
│
└── Data
    ├── Export All Data
    ├── Delete Account
    └── Privacy Settings
```

**AI & Memory Settings (Critical Section)**:

```
┌────────────────────────────────────────────────────────────────────────────┐
│  AI & Memory                                                               │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Memory Formation                                                          │
│  ─────────────────                                                         │
│  Control how Memento builds memory from your notes.                        │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │  ● Automatic                                                        │   │
│  │    AI learns from all notes and conversations                       │   │
│  │                                                                      │   │
│  │  ○ Selective                                                         │   │
│  │    AI asks before forming new memories                              │   │
│  │                                                                      │   │
│  │  ○ Manual Only                                                       │   │
│  │    Only explicit /remember commands create memories                 │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  Memory Scope                                                              │
│  ────────────                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │  ● Cross-workspace                                                  │   │
│  │    AI can connect ideas across all your workspaces                  │   │
│  │                                                                      │   │
│  │  ○ Workspace-isolated                                               │   │
│  │    Memories stay within their workspace                             │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  Confidence Display                                                        │
│  ──────────────────                                                        │
│  Show confidence indicators in AI responses                                │
│  [━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━○] Always                             │
│                                                                            │
│  Memory Retention                                                          │
│  ────────────────                                                          │
│  Automatically archive memories older than:                                │
│  [Never ▼]  (1 month / 3 months / 6 months / 1 year / Never)              │
│                                                                            │
│  ────────────────────────────────────────────────────────────────────────  │
│                                                                            │
│  [Export Memories]    [Clear All Memories]                                 │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 7. Sharing and Collaboration

**Sharing Model**:

1. **Note-level sharing**: Individual notes with link
2. **Workspace-level sharing**: Full workspace membership
3. **Temporary sharing**: Expiring links

**Share Dialog**:

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Share "API Design Document"                                          [✕] │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  People with access                                                        │
│  ──────────────────                                                        │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  [Avatar] You                                         Owner         │  │
│  │  [Avatar] alex@company.com                           Editor    [▼] │  │
│  │  [Avatar] jamie@company.com                          Viewer    [▼] │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  Add people by email...                                        [+] │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ────────────────────────────────────────────────────────────────────────  │
│                                                                            │
│  Get link                                                                  │
│  ────────                                                                  │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  https://memento.app/s/abc123def...                      [Copy]    │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  Anyone with link: [Can view ▼]                                           │
│                                                                            │
│  ☐ Include AI context (viewers can see related memories)                  │
│                                                                            │
│  [Share to Workspace...]                           [Done]                 │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

**Real-time Collaboration**:

- **Presence indicators**: Colored cursors with name labels
- **Live sync**: Character-by-character updates
- **Conflict resolution**: Last-write-wins with undo history
- **Comments**: Inline and margin comments

**Collaboration Indicators**:

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [Alex cursor: pink]  |  [Jamie cursor: blue]                              │
│                                                                            │
│  This is shared text that multiple people can edit simultaneously.         │
│                        ▲                                                   │
│                        │                                                   │
│                   [Alex is typing here]                                    │
│                                                                            │
│  ┌─────────────────────────────────────────────────┐                       │
│  │ 💬 Jamie commented on this paragraph            │ ← Margin comment      │
│  │    "Should we add more detail here?"            │                       │
│  │    [Reply] [Resolve]                            │                       │
│  └─────────────────────────────────────────────────┘                       │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Editor Component

### Rich Text Editing Experience

**Technology**: ProseMirror-based with custom extensions

**Core Capabilities**:
- Full Markdown support with live preview
- Block-level editing (drag to reorder)
- Nested lists with proper indentation
- Tables with cell-level formatting
- Code blocks with syntax highlighting
- Inline formatting (bold, italic, code, link)
- Image embedding with caption support
- File attachments

### Toolbar Behavior

**Floating Toolbar** (appears on text selection):

```
┌───────────────────────────────────────────────────────────────┐
│  B   I   U   S   </>  🔗  ▼                                   │
│  ─   ─   ─   ─   ───  ──  │                                   │
│ Bold Ital Under Strike Code Link More                         │
└───────────────────────────────────────────────────────────────┘
```

**More Menu**:
- Highlight color
- Clear formatting
- Convert to heading
- Create link to note
- Comment

**Block Toolbar** (appears on hover at line start):

```
    ⋮⋮ ← Drag handle
    │
    ▼
    ┌───────────────────────┐
    │ Turn into...          │
    │ ├ Paragraph           │
    │ ├ Heading 1           │
    │ ├ Heading 2           │
    │ ├ Heading 3           │
    │ ├ Bullet list         │
    │ ├ Numbered list       │
    │ ├ Toggle list         │
    │ ├ Quote               │
    │ ├ Code block          │
    │ └ Callout             │
    │──────────────────────│
    │ Delete                │
    │ Duplicate             │
    │ Copy link             │
    └───────────────────────┘
```

### Slash Commands

**Trigger**: Type `/` at start of line or after space

**Command Categories**:

```
/                                    ← Type to filter
─────────────────────────────────────
BASIC
  /text        Plain text paragraph
  /heading1    Large section heading
  /heading2    Medium section heading
  /heading3    Small section heading
  /quote       Quotation block
  /divider     Horizontal line

LISTS
  /bullet      Bulleted list
  /numbered    Numbered list
  /todo        Checkbox list
  /toggle      Collapsible section

MEDIA
  /image       Upload or embed image
  /file        Attach a file
  /embed       Embed external content
  /code        Code block with syntax

AI
  /ai          Ask AI about selection
  /summarize   Summarize this note
  /expand      Expand on this idea
  /remember    Save as explicit memory

ADVANCED
  /table       Insert table
  /columns     Multi-column layout
  /callout     Highlighted callout box
  /math        LaTeX equation
```

### Note Linking

**Trigger**: `[[`

**Behavior**:
1. Opens autocomplete dropdown
2. Shows matching notes (title search)
3. Shows recently linked notes first
4. Option to create new note if no match

```
[[api
┌───────────────────────────────────────┐
│ 🔗 API Design Document                │ ← Exact match
│    Work / Design                      │
│──────────────────────────────────────│
│ 🔗 API Authentication Notes           │
│    Work / Engineering                 │
│──────────────────────────────────────│
│ + Create "api" as new note            │
└───────────────────────────────────────┘
```

### Keyboard Shortcuts

**Essential Shortcuts**:

| Action | Mac | Windows |
|--------|-----|---------|
| Bold | `Cmd+B` | `Ctrl+B` |
| Italic | `Cmd+I` | `Ctrl+I` |
| Link | `Cmd+K` | `Ctrl+K` |
| Code | `Cmd+E` | `Ctrl+E` |
| Heading 1 | `Cmd+Opt+1` | `Ctrl+Alt+1` |
| Heading 2 | `Cmd+Opt+2` | `Ctrl+Alt+2` |
| Bullet List | `Cmd+Shift+8` | `Ctrl+Shift+8` |
| Numbered List | `Cmd+Shift+7` | `Ctrl+Shift+7` |
| Checkbox | `Cmd+Shift+9` | `Ctrl+Shift+9` |
| Quote | `Cmd+Shift+.` | `Ctrl+Shift+.` |
| Code Block | `Cmd+Opt+C` | `Ctrl+Alt+C` |
| Search | `Cmd+P` | `Ctrl+P` |
| AI Panel | `Cmd+J` | `Ctrl+J` |
| Focus Mode | `Cmd+\` | `Ctrl+\` |
| Save | Auto-save | Auto-save |

---

## AI Chat UX

### Message Bubbles

**User Messages**:

```svelte
<div class="flex justify-end mb-4">
  <div class="max-w-[80%] bg-stone-100 dark:bg-stone-800 rounded-2xl rounded-br-md px-4 py-3">
    <p class="text-stone-900 dark:text-stone-100">
      What did we decide about the authentication approach?
    </p>
    <span class="text-xs text-stone-500 mt-1 block">2:34 PM</span>
  </div>
</div>
```

**AI Response Messages**:

```svelte
<div class="flex justify-start mb-4">
  <div class="flex gap-3 max-w-[85%]">
    <div class="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
      <span class="text-violet-700 text-sm font-medium">M</span>
    </div>
    <div class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
      <div class="prose prose-stone dark:prose-invert prose-sm">
        <!-- Response content -->
      </div>

      <!-- Source citation -->
      <div class="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
        <div class="flex items-center gap-2 text-xs">
          <span class="inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
            <svg class="w-3 h-3"><!-- brain icon --></svg>
            High confidence
          </span>
          <a href="/note/123" class="text-violet-600 hover:underline">
            Auth Design Doc ↗
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Streaming Responses

**Visual Treatment**:
- Text appears word-by-word with subtle opacity fade
- Cursor indicator (blinking line) at end of stream
- No jittery layout shifts (pre-allocated height)

**Implementation Pattern**:

```svelte
<script>
  let displayedText = '';
  let isStreaming = false;

  async function streamResponse(response) {
    isStreaming = true;
    for await (const chunk of response) {
      displayedText += chunk;
      await tick(); // Allow UI update
    }
    isStreaming = false;
  }
</script>

<p class="text-stone-900">
  {displayedText}
  {#if isStreaming}
    <span class="animate-pulse">▎</span>
  {/if}
</p>
```

### Context Pills

**Purpose**: Show what context AI is using for response

```svelte
<!-- Context pills in AI panel header -->
<div class="flex flex-wrap gap-2 p-3 bg-stone-50 dark:bg-stone-800/50 border-b">
  <span class="text-xs text-stone-500 uppercase tracking-wide">Context:</span>

  <!-- Current note -->
  <button class="inline-flex items-center gap-1 px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-xs hover:bg-violet-200 transition-colors">
    <svg class="w-3 h-3"><!-- document icon --></svg>
    API Design Doc
    <svg class="w-3 h-3 opacity-60"><!-- close icon --></svg>
  </button>

  <!-- Workspace context -->
  <button class="inline-flex items-center gap-1 px-2 py-1 bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-full text-xs hover:bg-stone-200 transition-colors">
    <svg class="w-3 h-3"><!-- folder icon --></svg>
    Work (12 notes)
    <svg class="w-3 h-3 opacity-60"><!-- close icon --></svg>
  </button>

  <!-- Add context -->
  <button class="inline-flex items-center gap-1 px-2 py-1 border border-dashed border-stone-300 dark:border-stone-600 text-stone-500 rounded-full text-xs hover:border-stone-400 transition-colors">
    <svg class="w-3 h-3"><!-- plus icon --></svg>
    Add context
  </button>
</div>
```

### Memory Indicators

**Inline Citation** (within AI response):

```html
<span class="memory-citation">
  Based on your discussion in
  <a href="/note/456" class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded text-sm hover:bg-amber-100 transition-colors">
    <svg class="w-3 h-3"><!-- link icon --></svg>
    Authentication Notes
  </a>
</span>
```

**Memory Formation Notification** (when AI learns something new):

```svelte
<!-- Subtle notification in chat -->
<div class="flex items-center gap-2 py-2 px-3 mx-4 my-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-100 dark:border-violet-800">
  <svg class="w-4 h-4 text-violet-600"><!-- sparkle icon --></svg>
  <span class="text-sm text-violet-700 dark:text-violet-300">
    Memento noted: "Team prefers JWT with refresh rotation"
  </span>
  <button class="ml-auto text-xs text-violet-600 hover:underline">Undo</button>
</div>
```

---

## Component Library

### Design Philosophy

Components follow these principles:
1. **Minimal by default**: No decoration without purpose
2. **Consistent interaction**: Same patterns everywhere
3. **Accessible first**: ARIA compliance, keyboard navigation
4. **Dark mode native**: Designed for both themes simultaneously

### Buttons

**Variants**:

```svelte
<!-- Primary -->
<button class="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">
  Save Note
</button>

<!-- Secondary -->
<button class="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-medium rounded-lg transition-colors">
  Cancel
</button>

<!-- Ghost -->
<button class="px-4 py-2 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium rounded-lg transition-colors">
  Learn More
</button>

<!-- Danger -->
<button class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
  Delete
</button>

<!-- Icon Button -->
<button class="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors">
  <svg class="w-5 h-5"><!-- icon --></svg>
</button>
```

**Sizes**:

| Size | Padding | Font | Use Case |
|------|---------|------|----------|
| sm | `px-3 py-1.5` | `text-sm` | Inline actions |
| md | `px-4 py-2` | `text-base` | Default |
| lg | `px-6 py-3` | `text-lg` | Primary CTAs |

### Inputs

**Text Input**:

```svelte
<div class="space-y-1">
  <label for="title" class="block text-sm font-medium text-stone-700 dark:text-stone-300">
    Note Title
  </label>
  <input
    type="text"
    id="title"
    class="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow"
    placeholder="Untitled"
  />
</div>
```

**Search Input**:

```svelte
<div class="relative">
  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400">
    <!-- search icon -->
  </svg>
  <input
    type="search"
    class="w-full pl-10 pr-4 py-2 bg-stone-100 dark:bg-stone-800 border-0 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow"
    placeholder="Search notes, memories..."
  />
  <kbd class="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs bg-stone-200 dark:bg-stone-700 text-stone-500 rounded">
    ⌘K
  </kbd>
</div>
```

**Textarea**:

```svelte
<textarea
  class="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition-shadow"
  rows="4"
  placeholder="Write your thoughts..."
></textarea>
```

### Cards

**Note Card**:

```svelte
<article class="group p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl hover:border-stone-300 dark:hover:border-stone-600 hover:shadow-md transition-all cursor-pointer">
  <h3 class="font-medium text-stone-900 dark:text-stone-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
    API Design Document
  </h3>
  <p class="mt-1 text-sm text-stone-500 dark:text-stone-400 line-clamp-2">
    This document outlines our approach to the REST API redesign, focusing on backwards compatibility...
  </p>
  <div class="mt-3 flex items-center gap-2">
    <span class="text-xs text-stone-400">Updated 2h ago</span>
    <span class="inline-block px-2 py-0.5 text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-full">
      #api
    </span>
  </div>
</article>
```

**Workspace Card**:

```svelte
<div class="p-4 bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/30 dark:to-violet-800/20 border border-violet-200 dark:border-violet-700 rounded-xl hover:shadow-lg transition-shadow cursor-pointer">
  <div class="flex items-start justify-between">
    <div class="w-10 h-10 bg-violet-200 dark:bg-violet-800 rounded-lg flex items-center justify-center">
      <span class="text-lg">💼</span>
    </div>
    <span class="text-xs text-violet-600 dark:text-violet-400">12 memories</span>
  </div>
  <h3 class="mt-3 font-semibold text-violet-900 dark:text-violet-100">Work</h3>
  <p class="text-sm text-violet-700 dark:text-violet-300">156 notes</p>
</div>
```

**Memory Card**:

```svelte
<div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
  <div class="flex items-start gap-3">
    <div class="w-6 h-6 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center flex-shrink-0">
      <svg class="w-4 h-4 text-amber-700 dark:text-amber-300"><!-- brain icon --></svg>
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-stone-900 dark:text-stone-100">
        "Team prefers JWT with refresh token rotation for auth"
      </p>
      <div class="mt-2 flex items-center gap-3 text-xs text-stone-500">
        <span>High confidence</span>
        <span>•</span>
        <a href="/note/123" class="text-violet-600 hover:underline">Auth Notes</a>
        <span>•</span>
        <span>Jan 14</span>
      </div>
    </div>
    <button class="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300">
      <svg class="w-4 h-4"><!-- x icon --></svg>
    </button>
  </div>
</div>
```

### Modals

**Standard Modal**:

```svelte
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <!-- Backdrop -->
  <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" on:click={close}></div>

  <!-- Modal -->
  <div class="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
      <h2 class="text-lg font-semibold text-stone-900 dark:text-stone-100">
        Delete Note
      </h2>
      <button class="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800">
        <svg class="w-5 h-5"><!-- x icon --></svg>
      </button>
    </div>

    <!-- Content -->
    <div class="p-4">
      <p class="text-stone-600 dark:text-stone-400">
        Are you sure you want to delete "API Design Document"? This action cannot be undone.
      </p>
    </div>

    <!-- Footer -->
    <div class="flex justify-end gap-3 p-4 border-t border-stone-200 dark:border-stone-700">
      <button class="px-4 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors">
        Cancel
      </button>
      <button class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
        Delete
      </button>
    </div>
  </div>
</div>
```

### Dropdowns

```svelte
<div class="relative">
  <button class="flex items-center gap-2 px-3 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors">
    <span>Sort by</span>
    <svg class="w-4 h-4"><!-- chevron down --></svg>
  </button>

  <!-- Dropdown menu -->
  <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl shadow-lg py-1 z-50">
    <button class="w-full px-4 py-2 text-left text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between">
      Last modified
      <svg class="w-4 h-4 text-violet-600"><!-- check icon --></svg>
    </button>
    <button class="w-full px-4 py-2 text-left text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800">
      Created date
    </button>
    <button class="w-full px-4 py-2 text-left text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800">
      Alphabetical
    </button>
  </div>
</div>
```

### Tags

```svelte
<!-- Standard tag -->
<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-full text-xs">
  #api
</span>

<!-- Removable tag -->
<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-xs">
  #important
  <button class="hover:text-violet-900 dark:hover:text-violet-100">
    <svg class="w-3 h-3"><!-- x icon --></svg>
  </button>
</span>

<!-- Colored tag (user-defined) -->
<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
  completed
</span>
```

---

## Design Tokens

### Color Palette

**Primary Colors (Violet)**:

```css
/* Tailwind config extension */
violet: {
  50:  '#faf5ff',
  100: '#f3e8ff',
  200: '#e9d5ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7',
  600: '#9333ea',  /* Primary */
  700: '#7c3aed',
  800: '#6b21a8',
  900: '#581c87',
  950: '#3b0764',
}
```

**Neutral Colors (Stone)**:

```css
/* Warm neutral for text and backgrounds */
stone: {
  50:  '#fafaf9',
  100: '#f5f5f4',
  200: '#e7e5e4',
  300: '#d6d3d1',
  400: '#a8a29e',
  500: '#78716c',
  600: '#57534e',
  700: '#44403c',
  800: '#292524',
  900: '#1c1917',
  950: '#0c0a09',
}
```

**Semantic Colors**:

```css
/* Success - Green */
success: {
  light: '#dcfce7',
  DEFAULT: '#22c55e',
  dark: '#166534',
}

/* Warning - Amber */
warning: {
  light: '#fef3c7',
  DEFAULT: '#f59e0b',
  dark: '#b45309',
}

/* Error - Red */
error: {
  light: '#fee2e2',
  DEFAULT: '#ef4444',
  dark: '#b91c1c',
}

/* Info - Blue */
info: {
  light: '#dbeafe',
  DEFAULT: '#3b82f6',
  dark: '#1d4ed8',
}
```

**Memory/AI Colors**:

```css
/* Memory - Amber tones (warmth, knowledge) */
memory: {
  light: '#fffbeb',
  DEFAULT: '#fbbf24',
  dark: '#d97706',
}

/* AI - Violet tones (intelligence, creativity) */
ai: {
  light: '#f3e8ff',
  DEFAULT: '#a855f7',
  dark: '#7c3aed',
}
```

### Theme Configuration

**Light Mode**:

```css
:root {
  /* Backgrounds */
  --bg-primary: theme('colors.white');
  --bg-secondary: theme('colors.stone.50');
  --bg-tertiary: theme('colors.stone.100');

  /* Text */
  --text-primary: theme('colors.stone.900');
  --text-secondary: theme('colors.stone.600');
  --text-tertiary: theme('colors.stone.400');

  /* Borders */
  --border-default: theme('colors.stone.200');
  --border-strong: theme('colors.stone.300');

  /* Surfaces */
  --surface-elevated: theme('colors.white');
  --surface-sunken: theme('colors.stone.100');
}
```

**Dark Mode**:

```css
.dark {
  /* Backgrounds */
  --bg-primary: theme('colors.stone.950');
  --bg-secondary: theme('colors.stone.900');
  --bg-tertiary: theme('colors.stone.800');

  /* Text */
  --text-primary: theme('colors.stone.100');
  --text-secondary: theme('colors.stone.400');
  --text-tertiary: theme('colors.stone.500');

  /* Borders */
  --border-default: theme('colors.stone.700');
  --border-strong: theme('colors.stone.600');

  /* Surfaces */
  --surface-elevated: theme('colors.stone.900');
  --surface-sunken: theme('colors.stone.950');
}
```

### Typography

**Font Families**:

```css
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  serif: ['Source Serif Pro', 'Georgia', 'serif'],
  mono: ['JetBrains Mono', 'Menlo', 'monospace'],
}
```

**Usage**:
- **Sans**: UI elements, navigation, buttons
- **Serif**: Long-form content in notes (optional, user preference)
- **Mono**: Code blocks, technical content

**Type Scale**:

```css
fontSize: {
  xs:   ['0.75rem', { lineHeight: '1rem' }],      /* 12px - Metadata */
  sm:   ['0.875rem', { lineHeight: '1.25rem' }],  /* 14px - Secondary text */
  base: ['1rem', { lineHeight: '1.5rem' }],       /* 16px - Body */
  lg:   ['1.125rem', { lineHeight: '1.75rem' }],  /* 18px - Large body */
  xl:   ['1.25rem', { lineHeight: '1.75rem' }],   /* 20px - H3 */
  '2xl': ['1.5rem', { lineHeight: '2rem' }],      /* 24px - H2 */
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], /* 30px - H1 */
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   /* 36px - Page title */
}
```

**Font Weights**:

```css
fontWeight: {
  normal: 400,   /* Body text */
  medium: 500,   /* Emphasis, buttons */
  semibold: 600, /* Headings */
  bold: 700,     /* Strong emphasis */
}
```

### Spacing

**Scale** (Tailwind default extended):

```css
spacing: {
  0: '0',
  px: '1px',
  0.5: '0.125rem',   /* 2px */
  1: '0.25rem',      /* 4px */
  1.5: '0.375rem',   /* 6px */
  2: '0.5rem',       /* 8px */
  2.5: '0.625rem',   /* 10px */
  3: '0.75rem',      /* 12px */
  3.5: '0.875rem',   /* 14px */
  4: '1rem',         /* 16px - Base unit */
  5: '1.25rem',      /* 20px */
  6: '1.5rem',       /* 24px */
  7: '1.75rem',      /* 28px */
  8: '2rem',         /* 32px */
  9: '2.25rem',      /* 36px */
  10: '2.5rem',      /* 40px */
  12: '3rem',        /* 48px */
  14: '3.5rem',      /* 56px */
  16: '4rem',        /* 64px */
  20: '5rem',        /* 80px */
  24: '6rem',        /* 96px */
}
```

**Semantic Spacing**:

| Token | Value | Use |
|-------|-------|-----|
| `space-xs` | 4px | Inline spacing, icon gaps |
| `space-sm` | 8px | Related elements |
| `space-md` | 16px | Component padding |
| `space-lg` | 24px | Section spacing |
| `space-xl` | 32px | Page sections |
| `space-2xl` | 48px | Major sections |

### Shadows

```css
boxShadow: {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
}

/* Dark mode adjustments - shadows less visible, use borders instead */
```

### Border Radius

```css
borderRadius: {
  none: '0',
  sm: '0.25rem',    /* 4px - Small elements */
  DEFAULT: '0.375rem', /* 6px - Buttons, inputs */
  md: '0.5rem',     /* 8px - Cards */
  lg: '0.75rem',    /* 12px - Larger cards */
  xl: '1rem',       /* 16px - Modals */
  '2xl': '1.5rem',  /* 24px - Large surfaces */
  full: '9999px',   /* Pills, avatars */
}
```

---

## Micro-interactions

### Editor Transitions

**Block Insert Animation**:

```css
@keyframes block-insert {
  from {
    opacity: 0;
    transform: translateY(-8px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 500px;
  }
}

.block-enter {
  animation: block-insert 200ms ease-out;
}
```

**Slash Command Menu**:

```css
@keyframes dropdown-enter {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.slash-menu-enter {
  animation: dropdown-enter 150ms ease-out;
  transform-origin: top left;
}
```

**Floating Toolbar**:

```css
@keyframes toolbar-appear {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.floating-toolbar {
  animation: toolbar-appear 100ms ease-out;
}
```

### AI Typing Indicators

**Streaming Cursor**:

```css
@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.streaming-cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background-color: currentColor;
  animation: cursor-blink 1s steps(1) infinite;
  vertical-align: text-bottom;
  margin-left: 1px;
}
```

**Thinking Indicator**:

```svelte
<!-- Three-dot thinking animation -->
<div class="flex items-center gap-1">
  <div class="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
  <div class="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
  <div class="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
</div>
```

**Word Fade-In**:

```css
@keyframes word-appear {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}

.ai-word {
  animation: word-appear 300ms ease-out forwards;
}
```

### Memory Updates

**Memory Formation Toast**:

```css
@keyframes memory-toast {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  15% {
    opacity: 1;
    transform: translateY(0);
  }
  85% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.memory-toast {
  animation: memory-toast 4s ease-in-out forwards;
}
```

**Memory Link Highlight**:

```css
@keyframes memory-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(251, 191, 36, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0);
  }
}

.memory-reference:hover {
  animation: memory-pulse 1.5s ease-out;
}
```

### Panel Transitions

**Sidebar Collapse**:

```css
.sidebar {
  transition: width 200ms ease-out, padding 200ms ease-out;
}

.sidebar-collapsed {
  width: 56px;
}

.sidebar-expanded {
  width: 240px;
}

/* Content fade for collapsed state */
.sidebar-collapsed .sidebar-text {
  opacity: 0;
  transition: opacity 100ms ease-out;
}

.sidebar-expanded .sidebar-text {
  opacity: 1;
  transition: opacity 100ms ease-in 100ms;
}
```

**AI Panel Slide**:

```css
@keyframes panel-slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes panel-slide-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.ai-panel-enter {
  animation: panel-slide-in 250ms ease-out;
}

.ai-panel-exit {
  animation: panel-slide-out 200ms ease-in;
}
```

### Hover and Focus States

**Card Hover**:

```css
.note-card {
  transition: transform 150ms ease-out, box-shadow 150ms ease-out, border-color 150ms ease-out;
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

**Button Press**:

```css
.button {
  transition: transform 75ms ease-out, box-shadow 75ms ease-out;
}

.button:active {
  transform: scale(0.98);
}
```

**Focus Ring**:

```css
.focusable:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--bg-primary), 0 0 0 4px var(--color-violet-500);
}
```

---

## Responsive Strategy

### Breakpoints

```css
screens: {
  'sm': '640px',   /* Large phones */
  'md': '768px',   /* Tablets */
  'lg': '1024px',  /* Small laptops */
  'xl': '1280px',  /* Desktops */
  '2xl': '1536px', /* Large desktops */
}
```

### Layout Adaptations

**Desktop (1280px+)**: Full experience

```
┌─────┬────────────────────────────────────────────────┐
│     │                                                │
│ Nav │              Main Content                      │
│     │                                                │
│     ├────────────────────────────┬───────────────────┤
│     │         Editor             │     AI Panel     │
│     │                            │                   │
│     │                            │                   │
└─────┴────────────────────────────┴───────────────────┘
```

**Laptop (1024px - 1279px)**: Condensed sidebar

```
┌───┬───────────────────────────────────────────────────┐
│ N │                                                   │
│ a │                 Main Content                      │
│ v │                                                   │
│   ├───────────────────────────────────────────────────┤
│ i │                                                   │
│ c │        Editor (full width, AI overlay)            │
│ o │                                                   │
│ n │                                                   │
└───┴───────────────────────────────────────────────────┘
```

**Tablet (768px - 1023px)**: Slide-out navigation

```
┌───────────────────────────────────────────────────────┐
│ ☰  Workspace Name                      [AI] [Search] │
├───────────────────────────────────────────────────────┤
│                                                       │
│                                                       │
│                 Editor (full width)                   │
│                                                       │
│                                                       │
│           AI Panel slides up from bottom              │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### Component Adaptations

**Navigation**:
- Desktop: Persistent sidebar (240px)
- Laptop: Collapsed icon-only sidebar (56px)
- Tablet: Hamburger menu with slide-out drawer

**AI Panel**:
- Desktop: Side panel (400px) or split view
- Laptop: Overlay panel (400px)
- Tablet: Bottom sheet (70% height)

**Editor**:
- Desktop: Max-width container (720px) centered
- Tablet: Full-width with horizontal padding

**Notes List**:
- Desktop: Three-column (folders + list + preview)
- Laptop: Two-column (list + preview)
- Tablet: Single-column (list only, tap to open)

### Touch Considerations

**Tablet Optimizations**:

1. **Larger Touch Targets**
   - Minimum 44x44px for interactive elements
   - Increased padding in list items
   - Bigger action buttons

2. **Gesture Support**
   - Swipe to reveal note actions
   - Pull to refresh in lists
   - Pinch to zoom in preview

3. **Toolbar Adaptation**
   - Floating toolbar replaced with bottom bar
   - Larger formatting buttons
   - Dedicated undo/redo buttons

4. **Keyboard Awareness**
   - Adjust layout when keyboard appears
   - Keep input field visible
   - Provide toolbar above keyboard

### Performance Considerations

**Responsive Images**:

```html
<picture>
  <source media="(min-width: 1024px)" srcset="image-large.webp">
  <source media="(min-width: 768px)" srcset="image-medium.webp">
  <img src="image-small.webp" alt="..." loading="lazy">
</picture>
```

**Conditional Loading**:
- Defer AI panel initialization on smaller screens
- Lazy load preview panel content
- Reduce animation complexity on mobile

---

## Accessibility

### Keyboard Navigation

**Global Shortcuts**:

| Key | Action |
|-----|--------|
| `Cmd+K` / `Ctrl+K` | Open search |
| `Cmd+J` / `Ctrl+J` | Toggle AI panel |
| `Cmd+\` / `Ctrl+\` | Toggle sidebar |
| `Cmd+N` / `Ctrl+N` | New note |
| `Escape` | Close modal/panel |

**Focus Management**:
- Logical tab order follows visual layout
- Focus trap in modals
- Skip links for main content areas
- Visible focus indicators (2px ring)

### Screen Reader Support

**ARIA Landmarks**:

```html
<header role="banner">...</header>
<nav role="navigation" aria-label="Main">...</nav>
<main role="main">...</main>
<aside role="complementary" aria-label="AI Assistant">...</aside>
```

**Dynamic Content**:

```html
<!-- AI response streaming -->
<div role="log" aria-live="polite" aria-label="AI conversation">
  <div role="article" aria-label="AI response">
    <!-- Response content -->
  </div>
</div>

<!-- Memory notification -->
<div role="status" aria-live="polite">
  Memento noted: "Team prefers JWT authentication"
</div>
```

**Form Labels**:

```html
<label for="note-title" class="sr-only">Note title</label>
<input id="note-title" type="text" placeholder="Untitled">

<button aria-label="Bold" title="Bold (Cmd+B)">
  <svg aria-hidden="true">...</svg>
</button>
```

### Color Contrast

**Requirements**:
- Text: Minimum 4.5:1 contrast ratio
- Large text: Minimum 3:1 contrast ratio
- Interactive elements: Minimum 3:1 against adjacent colors

**Verification**:
- All color combinations tested in both light and dark modes
- Confidence indicators use icons in addition to color
- Error states include text labels, not just red color

### Motion and Animation

**Reduced Motion Support**:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Essential Motion Only**:
- Streaming text cursor still indicates progress
- Panel transitions become instant
- Decorative animations disabled

### Visual Accessibility

**High Contrast Mode**:

```css
@media (prefers-contrast: high) {
  :root {
    --border-default: theme('colors.stone.900');
    --bg-secondary: theme('colors.white');
  }

  .dark {
    --border-default: theme('colors.stone.100');
    --bg-secondary: theme('colors.stone.950');
  }

  /* Increase border width */
  .card, .button, .input {
    border-width: 2px;
  }
}
```

**Text Spacing**:
- Line height: Minimum 1.5 for body text
- Paragraph spacing: Minimum 1.5x font size
- Letter spacing: Adjustable in settings

---

## Appendix A: Tailwind Configuration

```javascript
// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        violet: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        memory: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        serif: ['Source Serif Pro', ...defaultTheme.fontFamily.serif],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      animation: {
        'bounce-slow': 'bounce 1.5s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.stone.700'),
            '--tw-prose-headings': theme('colors.stone.900'),
            '--tw-prose-links': theme('colors.violet.600'),
            '--tw-prose-code': theme('colors.violet.700'),
          },
        },
        invert: {
          css: {
            '--tw-prose-body': theme('colors.stone.300'),
            '--tw-prose-headings': theme('colors.stone.100'),
            '--tw-prose-links': theme('colors.violet.400'),
            '--tw-prose-code': theme('colors.violet.300'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
```

---

## Appendix B: Component Index

| Component | Location | Purpose |
|-----------|----------|---------|
| `Button` | `components/ui/Button.svelte` | All button variants |
| `Input` | `components/ui/Input.svelte` | Text inputs |
| `Card` | `components/ui/Card.svelte` | Generic card container |
| `NoteCard` | `components/notes/NoteCard.svelte` | Note preview card |
| `WorkspaceCard` | `components/workspaces/WorkspaceCard.svelte` | Workspace tile |
| `MemoryCard` | `components/ai/MemoryCard.svelte` | Memory display |
| `Modal` | `components/ui/Modal.svelte` | Dialog wrapper |
| `Dropdown` | `components/ui/Dropdown.svelte` | Dropdown menu |
| `Tag` | `components/ui/Tag.svelte` | Tag pills |
| `Avatar` | `components/ui/Avatar.svelte` | User avatars |
| `ChatMessage` | `components/ai/ChatMessage.svelte` | AI conversation bubble |
| `ContextPill` | `components/ai/ContextPill.svelte` | Context indicator |
| `Editor` | `components/editor/Editor.svelte` | Main rich text editor |
| `SlashMenu` | `components/editor/SlashMenu.svelte` | Command palette |
| `FloatingToolbar` | `components/editor/FloatingToolbar.svelte` | Selection toolbar |
| `Sidebar` | `components/layout/Sidebar.svelte` | Main navigation |
| `AIPanel` | `components/ai/AIPanel.svelte` | AI chat interface |
| `MemoryBrowser` | `components/ai/MemoryBrowser.svelte` | Memory management |

---

## Appendix C: Design Checklist

Before shipping any view:

**Visual Design**
- [ ] Consistent spacing using design tokens
- [ ] Proper color contrast in both themes
- [ ] Typography hierarchy is clear
- [ ] Icons are consistent size and style
- [ ] Loading states are designed
- [ ] Empty states are designed
- [ ] Error states are designed

**Interaction Design**
- [ ] All interactive elements have hover states
- [ ] Focus states are visible and consistent
- [ ] Transitions are smooth and purposeful
- [ ] Touch targets are minimum 44x44px
- [ ] Feedback is immediate for all actions

**Accessibility**
- [ ] Keyboard navigation works
- [ ] Screen reader testing complete
- [ ] Color is not only indicator
- [ ] Reduced motion is respected
- [ ] Labels exist for all form fields

**Responsive**
- [ ] Works on 768px viewport
- [ ] Works on 1024px viewport
- [ ] Works on 1440px+ viewport
- [ ] No horizontal scroll at any breakpoint

---

*This document is a living specification. Updates should be tracked with version numbers and change dates.*
