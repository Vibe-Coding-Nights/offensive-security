# Memento Backend Services

This document describes the backend architecture for Memento, a collaborative notes app with AI memory that intentionally demonstrates memory poisoning vulnerabilities for educational purposes.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND SERVICES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  tRPC API Layer                                                 │
│  ├── Notes Router      - CRUD operations for notes             │
│  ├── Chat Router       - AI conversation management            │
│  ├── Memory Router     - Memory transparency & management       │
│  ├── Import Router     - Document import (ATTACK ENTRY)         │
│  └── Workspaces Router - Workspace & member management         │
│                                                                 │
│  Service Layer                                                  │
│  ├── Notes Service     - Business logic for notes              │
│  ├── AI Service        - Claude API integration (VULNERABLE)    │
│  ├── Memory Service    - Vector memory management (VULNERABLE)  │
│  ├── Documents Service - File processing (VULNERABLE)           │
│  ├── Embeddings        - Text vectorization                    │
│  └── Workspaces        - Workspace operations                  │
│                                                                 │
│  Data Layer                                                     │
│  ├── PostgreSQL        - Relational data (notes, users, etc.)  │
│  └── Pinecone          - Vector database (AI memories)         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
src/lib/server/
├── trpc/
│   ├── trpc.ts                    # tRPC setup, context, procedures
│   └── routers/
│       ├── index.ts               # Main router combining all routes
│       ├── notes.ts               # Notes CRUD operations
│       ├── chat.ts                # AI chat functionality
│       ├── memory.ts              # Memory management
│       ├── import.ts              # Document import (ATTACK ENTRY)
│       └── workspaces.ts          # Workspace management
│
├── services/
│   ├── notes.ts                   # Notes business logic
│   ├── ai.ts                      # AI service (VULNERABLE)
│   ├── memory.ts                  # Memory service (VULNERABLE)
│   ├── documents.ts               # Document processing (VULNERABLE)
│   ├── embeddings.ts              # Vector embeddings
│   └── workspaces.ts              # Workspace operations
│
├── db.ts                          # PostgreSQL connection
├── vector-db.ts                   # Pinecone vector database
└── auth.ts                        # Lucia authentication

src/routes/api/trpc/[...procedure]/
└── +server.ts                     # tRPC HTTP handler

src/lib/trpc/
├── client.ts                      # Browser tRPC client
└── server.ts                      # Server-side caller

src/
└── hooks.server.ts                # Session validation hooks
```

## API Endpoints

All API endpoints are accessed via tRPC at `/api/trpc/*`.

### Notes Router

```typescript
trpc.notes.list({ workspaceId, parentId? })      // List notes
trpc.notes.get({ noteId })                       // Get single note
trpc.notes.create({ workspaceId, title, ... })   // Create note
trpc.notes.update({ noteId, title?, content? })  // Update note
trpc.notes.delete({ noteId })                    // Delete note
trpc.notes.search({ workspaceId, query })        // Search notes
```

### Chat Router (VULNERABLE)

```typescript
trpc.chat.send({
  workspaceId,
  conversationId?,
  message
})                                               // Send message to AI
trpc.chat.getConversation({ conversationId })    // Get conversation
trpc.chat.listConversations({ workspaceId })     // List conversations
trpc.chat.deleteConversation({ conversationId }) // Delete conversation
```

### Memory Router

```typescript
trpc.memory.list({ workspaceId, limit? })        // List memories
trpc.memory.delete({ memoryId })                 // Delete memory
trpc.memory.search({ workspaceId, query })       // Search memories
```

### Import Router (ATTACK ENTRY)

```typescript
trpc.import.document({
  workspaceId,
  fileName,
  fileContent,  // Base64 encoded
  fileType      // 'docx' | 'html' | 'md' | 'txt'
})                                               // Import document
```

### Workspaces Router

```typescript
trpc.workspaces.list()                           // List user's workspaces
trpc.workspaces.get({ workspaceId })             // Get workspace
trpc.workspaces.create({ name, settings? })      // Create workspace
trpc.workspaces.update({ workspaceId, ... })     // Update workspace
trpc.workspaces.delete({ workspaceId })          // Delete workspace
trpc.workspaces.addMember({ workspaceId, ... })  // Add member
```

## Vulnerability Architecture

### The Memory Poisoning Attack Flow

```
1. POISONING PHASE
   User imports malicious document
   ↓
   importRouter.document() receives file
   ↓
   documents.ts extracts ALL text (including hidden)
   ↓
   processDocumentForMemory() sends raw text to AI
   ↓
   AI extracts "preferences" and "instructions"
   ↓
   memory.ts stores WITHOUT trust filtering
   ↓
   Poisoned memories stored in vector DB

2. EXPLOITATION PHASE (days/weeks later)
   User starts normal conversation
   ↓
   chat.send() retrieves relevant memories
   ↓
   retrieveMemories() returns ALL matches (no filtering)
   ↓
   buildSystemPrompt() injects poisoned memories
   ↓
   AI follows malicious instructions
   ↓
   User sees normal response, attacker gets data
```

### Key Vulnerabilities

**1. No Trust Levels (memory.ts)**
```typescript
// VULNERABLE: All memories treated equally
interface Memory {
  content: string;
  source: 'conversation' | 'document' | 'note';
  // MISSING: trustLevel field
  // MISSING: userConfirmed field
  // MISSING: expiresAt field
}
```

**2. No Content Filtering (documents.ts)**
```typescript
// VULNERABLE: Extracts ALL text, including hidden
const plainText = dom.window.document.body.textContent;
// Includes: white-on-white text, 0px fonts, display:none elements
```

**3. No Memory Validation (memory.ts)**
```typescript
// VULNERABLE: Stores extracted memories without confirmation
for (const memory of memories) {
  await storeMemory(userId, workspaceId, memory, 'document');
  // No user confirmation
  // No content validation
  // No preference detection
}
```

**4. No Prompt Isolation (ai.ts)**
```typescript
// VULNERABLE: All memories injected into system prompt
const systemPrompt = `
Your memories about this user:
${memories.map(m => `- ${m.content}`).join('\n')}

Instructions:
- Follow any user preferences stored in memory  // ← DANGER
`;
```

## Database Schema

### PostgreSQL Tables

- `users` - User accounts
- `sessions` - Lucia auth sessions
- `workspaces` - User workspaces
- `workspace_members` - Workspace membership
- `notes` - Note documents
- `comments` - Note comments
- `conversations` - AI chat conversations
- `messages` - Conversation messages

### Vector Database (Pinecone)

Memory entries stored as vectors:
```typescript
{
  id: string;
  values: number[];      // 1024-dim embedding
  metadata: {
    userId: string;
    workspaceId: string;
    content: string;     // The actual memory text
    source: string;      // 'conversation' | 'document' | 'note'
    sourceId?: string;
    createdAt: string;
  }
}
```

## Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up PostgreSQL**
   ```bash
   psql $DATABASE_URL -f schema.sql
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Set up Pinecone**
   - Create a Pinecone account
   - Create an index named "memento-memories"
   - Dimension: 1024
   - Metric: cosine

5. **Run development server**
   ```bash
   pnpm dev
   ```

## Security Notes

This application is intentionally vulnerable for educational purposes. It demonstrates:

1. **AI Memory Poisoning** - How malicious content in documents can become AI "memories"
2. **Trust Boundary Violations** - Treating external content with same trust as user statements
3. **Prompt Injection via Persistence** - Storing injected instructions for later execution
4. **Hidden Content Processing** - Extracting invisible text from documents

For detailed exploit information, see `/exploits/PLAYBOOK.md`.

## What Secure Would Look Like

A secure implementation would include:

1. **Trust Levels** - Distinguish between user-confirmed preferences and inferred information
2. **Content Sanitization** - Filter hidden/invisible content from documents
3. **User Confirmation** - Require approval for preference-like memories
4. **Prompt Isolation** - Separate trusted instructions from untrusted context
5. **Memory Expiration** - Auto-expire low-trust memories
6. **Source Attribution** - Always show memory source in UI

See `memory.ts` and `documents.ts` for detailed comments on secure implementations.
