# Database Schema Reference

Quick reference for the Memento database schema.

## Entity Relationship Diagram

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌──────────────────┐
│   Session   │   │ WorkspaceMember  │
└─────────────┘   └────────┬─────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Workspace   │
                    └──────┬───────┘
                           │
                    ┌──────┴──────────┬────────────────┐
                    │                 │                │
                    ▼                 ▼                ▼
               ┌─────────┐     ┌──────────────┐  ┌─────────┐
               │  Note   │────▶│  Comment     │  │  Conv.  │
               └────┬────┘     └──────────────┘  └────┬────┘
                    │                                 │
                    │ (self-ref)                      ▼
                    │                           ┌──────────┐
                    └──────────────────────────▶│ Message  │
                                                └──────────┘
┌─────────────┐
│   Memory    │ (+ Pinecone vectors)
└─────────────┘
```

## Models

### User
User accounts with authentication.

| Field          | Type     | Constraints      | Description                    |
|----------------|----------|------------------|--------------------------------|
| id             | String   | PK, cuid         | Unique identifier              |
| email          | String   | Unique, Indexed  | User email address             |
| name           | String   | Required         | Display name                   |
| avatarUrl      | String?  | Optional         | Profile picture URL            |
| hashedPassword | String?  | Optional         | Bcrypt hashed password         |
| createdAt      | DateTime | Auto             | Account creation timestamp     |
| updatedAt      | DateTime | Auto             | Last update timestamp          |

**Relations:**
- sessions → Session[]
- workspaces → WorkspaceMember[]
- notes → Note[]
- conversations → Conversation[]
- comments → Comment[]

---

### Session
Authentication sessions for users.

| Field     | Type     | Constraints | Description                |
|-----------|----------|-------------|----------------------------|
| id        | String   | PK, cuid    | Unique identifier          |
| userId    | String   | FK, Indexed | Reference to User          |
| expiresAt | DateTime | Required    | Session expiration time    |

**Relations:**
- user → User (CASCADE delete)

---

### Workspace
Organizational containers for notes and conversations.

| Field     | Type     | Constraints      | Description                    |
|-----------|----------|------------------|--------------------------------|
| id        | String   | PK, cuid         | Unique identifier              |
| name      | String   | Required         | Workspace display name         |
| slug      | String   | Unique, Indexed  | URL-friendly identifier        |
| settings  | Json     | Default: {}      | Workspace configuration        |
| createdAt | DateTime | Auto             | Creation timestamp             |
| updatedAt | DateTime | Auto             | Last update timestamp          |

**Relations:**
- members → WorkspaceMember[]
- notes → Note[]
- conversations → Conversation[]

---

### WorkspaceMember
User membership in workspaces with roles.

| Field       | Type          | Constraints    | Description              |
|-------------|---------------|----------------|--------------------------|
| workspaceId | String        | PK, FK         | Reference to Workspace   |
| userId      | String        | PK, FK, Indexed| Reference to User        |
| role        | WorkspaceRole | Default: MEMBER| User role in workspace   |

**Composite Primary Key:** (workspaceId, userId)

**Relations:**
- workspace → Workspace (CASCADE delete)
- user → User (CASCADE delete)

**Enum WorkspaceRole:**
- OWNER - Full control
- ADMIN - Manage members and settings
- MEMBER - Create and edit content
- VIEWER - Read-only access

---

### Note
Rich text documents with hierarchical structure.

| Field        | Type     | Constraints        | Description                      |
|--------------|----------|--------------------|----------------------------------|
| id           | String   | PK, cuid           | Unique identifier                |
| workspaceId  | String   | FK, Indexed        | Reference to Workspace           |
| parentId     | String?  | FK, Indexed        | Parent note (for hierarchy)      |
| title        | String   | Default: "Untitled"| Note title                       |
| content      | Json     | Default: {}        | TipTap JSON document             |
| contentText  | String?  | Text               | Plain text for search            |
| icon         | String?  | Optional           | Emoji or icon identifier         |
| coverUrl     | String?  | Optional           | Cover image URL                  |
| createdById  | String   | FK, Indexed        | Reference to User                |
| importedFrom | String?  | Optional           | Original filename if imported    |
| importedAt   | DateTime?| Optional           | Import timestamp                 |
| createdAt    | DateTime | Auto               | Creation timestamp               |
| updatedAt    | DateTime | Auto               | Last update timestamp            |

**Relations:**
- workspace → Workspace (CASCADE delete)
- parent → Note? (SET NULL on delete)
- children → Note[]
- createdBy → User
- comments → Comment[]

**Hierarchy Example:**
```
Note 1
├── Note 1.1
│   ├── Note 1.1.1
│   └── Note 1.1.2
└── Note 1.2
```

---

### Comment
Annotations on notes with text selection support.

| Field     | Type     | Constraints | Description                  |
|-----------|----------|-------------|------------------------------|
| id        | String   | PK, cuid    | Unique identifier            |
| noteId    | String   | FK, Indexed | Reference to Note            |
| userId    | String   | FK          | Reference to User            |
| content   | String   | Text        | Comment content              |
| selection | Json?    | Optional    | Text selection anchor        |
| resolved  | Boolean  | Default: false | Resolution status         |
| createdAt | DateTime | Auto        | Creation timestamp           |
| updatedAt | DateTime | Auto        | Last update timestamp        |

**Relations:**
- note → Note (CASCADE delete)
- user → User

**Selection Format:**
```json
{
  "anchor": 0,
  "head": 20
}
```

---

### Conversation
AI chat conversation threads.

| Field       | Type     | Constraints | Description                 |
|-------------|----------|-------------|-----------------------------|
| id          | String   | PK, cuid    | Unique identifier           |
| workspaceId | String   | FK, Indexed | Reference to Workspace      |
| userId      | String   | FK, Indexed | Reference to User           |
| title       | String?  | Optional    | Conversation title          |
| createdAt   | DateTime | Auto        | Creation timestamp          |
| updatedAt   | DateTime | Auto        | Last update timestamp       |

**Relations:**
- workspace → Workspace (CASCADE delete)
- user → User
- messages → Message[]

---

### Message
Individual messages in conversations.

| Field          | Type        | Constraints | Description                  |
|----------------|-------------|-------------|------------------------------|
| id             | String      | PK, cuid    | Unique identifier            |
| conversationId | String      | FK, Indexed | Reference to Conversation    |
| role           | MessageRole | Required    | Message sender role          |
| content        | String      | Text        | Message content              |
| metadata       | Json        | Default: {} | Referenced notes, context    |
| createdAt      | DateTime    | Auto        | Creation timestamp           |

**Relations:**
- conversation → Conversation (CASCADE delete)

**Enum MessageRole:**
- USER - User message
- ASSISTANT - AI response
- SYSTEM - System message

**Metadata Format:**
```json
{
  "referencedNotes": ["note_id_1", "note_id_2"],
  "confidence": 0.95,
  "model": "claude-3-5-sonnet"
}
```

---

### Memory
AI memory fragments with vector embeddings.

| Field       | Type         | Constraints      | Description                     |
|-------------|--------------|------------------|---------------------------------|
| id          | String       | PK, cuid         | Unique identifier               |
| userId      | String       | Indexed          | Reference to User               |
| workspaceId | String       | Indexed          | Reference to Workspace          |
| content     | String       | Text             | Memory content                  |
| source      | MemorySource | Indexed          | Memory source type              |
| sourceId    | String?      | Optional         | Reference to source entity      |
| createdAt   | DateTime     | Auto             | Creation timestamp              |

**Relations:**
- None (intentionally decoupled for flexibility)

**Enum MemorySource:**
- CONVERSATION - From AI conversations
- DOCUMENT - From imported documents
- NOTE - From note content
- MANUAL - User-provided

**Vector Storage:**
- Metadata stored in PostgreSQL
- 1536-dimensional embeddings stored in Pinecone
- Cosine similarity for retrieval

**Security Note:**
This model intentionally lacks:
- `trustLevel` - All memories treated equally
- `userConfirmed` - No verification
- `expiresAt` - Permanent storage

This enables memory poisoning demonstrations.

---

## Indexes

### Performance Indexes

```sql
-- User
CREATE INDEX "User_email_idx" ON "User"("email");

-- Session
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- Workspace
CREATE INDEX "Workspace_slug_idx" ON "Workspace"("slug");

-- WorkspaceMember
CREATE INDEX "WorkspaceMember_userId_idx" ON "WorkspaceMember"("userId");

-- Note
CREATE INDEX "Note_workspaceId_idx" ON "Note"("workspaceId");
CREATE INDEX "Note_parentId_idx" ON "Note"("parentId");
CREATE INDEX "Note_createdById_idx" ON "Note"("createdById");

-- Comment
CREATE INDEX "Comment_noteId_idx" ON "Comment"("noteId");

-- Conversation
CREATE INDEX "Conversation_workspaceId_idx" ON "Conversation"("workspaceId");
CREATE INDEX "Conversation_userId_idx" ON "Conversation"("userId");

-- Message
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- Memory
CREATE INDEX "Memory_userId_idx" ON "Memory"("userId");
CREATE INDEX "Memory_workspaceId_idx" ON "Memory"("workspaceId");
CREATE INDEX "Memory_source_idx" ON "Memory"("source");
```

## Common Queries

### User & Authentication

```typescript
// Find user by email
const user = await db.user.findUnique({
  where: { email: 'user@example.com' }
});

// Validate session
const session = await db.session.findFirst({
  where: {
    id: sessionId,
    expiresAt: { gt: new Date() }
  },
  include: { user: true }
});
```

### Workspace Access

```typescript
// Get user's workspaces
const workspaces = await db.workspace.findMany({
  where: {
    members: {
      some: { userId: user.id }
    }
  }
});

// Check workspace access
const member = await db.workspaceMember.findUnique({
  where: {
    workspaceId_userId: {
      workspaceId: workspace.id,
      userId: user.id
    }
  }
});

const hasAccess = member !== null;
const isOwner = member?.role === 'OWNER';
```

### Notes

```typescript
// Get workspace notes (flat)
const notes = await db.note.findMany({
  where: { workspaceId: workspace.id },
  orderBy: { updatedAt: 'desc' }
});

// Get note tree (root notes only)
const rootNotes = await db.note.findMany({
  where: {
    workspaceId: workspace.id,
    parentId: null
  },
  include: {
    children: {
      include: {
        children: true // Nest as needed
      }
    }
  }
});

// Search notes
const results = await db.note.findMany({
  where: {
    workspaceId: workspace.id,
    contentText: {
      contains: searchQuery,
      mode: 'insensitive'
    }
  }
});
```

### Conversations

```typescript
// Get user's conversations
const conversations = await db.conversation.findMany({
  where: {
    userId: user.id,
    workspaceId: workspace.id
  },
  include: {
    messages: {
      orderBy: { createdAt: 'asc' },
      take: 1 // Last message for preview
    }
  }
});

// Get full conversation
const conversation = await db.conversation.findUnique({
  where: { id: conversationId },
  include: {
    messages: {
      orderBy: { createdAt: 'asc' }
    }
  }
});
```

### Memories

```typescript
// Get user's memories
const memories = await db.memory.findMany({
  where: {
    userId: user.id,
    workspaceId: workspace.id
  },
  orderBy: { createdAt: 'desc' }
});

// Get memories by source
const noteMemories = await db.memory.findMany({
  where: {
    userId: user.id,
    source: 'NOTE',
    sourceId: note.id
  }
});
```

## Data Types

### TipTap Content Structure

```typescript
type TipTapDocument = {
  type: 'doc';
  content: TipTapNode[];
};

type TipTapNode = {
  type: string;
  attrs?: Record<string, any>;
  content?: TipTapNode[];
  marks?: { type: string; attrs?: Record<string, any> }[];
  text?: string;
};

// Example
{
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [
        { type: 'text', text: 'Welcome' }
      ]
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          marks: [{ type: 'bold' }],
          text: 'Bold text'
        }
      ]
    }
  ]
}
```

### Workspace Settings

```typescript
type WorkspaceSettings = {
  theme?: 'light' | 'dark';
  aiEnabled?: boolean;
  defaultNoteIcon?: string;
  // Add custom settings as needed
};
```

### Message Metadata

```typescript
type MessageMetadata = {
  referencedNotes?: string[];
  confidence?: number;
  model?: string;
  tokensUsed?: number;
  processingTime?: number;
};
```

## Migration History

### Initial Schema (v1.0.0)

```bash
npx prisma migrate dev --name init
```

Creates:
- All 11 models
- All indexes
- All relationships
- Default values

## Best Practices

1. **Always use transactions for related operations:**
   ```typescript
   await db.$transaction([
     db.note.create({ data: noteData }),
     db.memory.create({ data: memoryData })
   ]);
   ```

2. **Use select to reduce data transfer:**
   ```typescript
   const users = await db.user.findMany({
     select: { id: true, name: true, email: true }
   });
   ```

3. **Implement soft deletes for important data:**
   ```typescript
   // Add to schema
   deletedAt DateTime?

   // "Delete"
   await db.note.update({
     where: { id },
     data: { deletedAt: new Date() }
   });

   // Query
   where: { deletedAt: null }
   ```

4. **Use connection pooling in production:**
   ```typescript
   const db = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL + '?connection_limit=10'
       }
     }
   });
   ```

## Troubleshooting

### Schema Drift

```bash
# Check current schema state
npx prisma db pull

# Generate new client
npx prisma generate

# Create migration from drift
npx prisma migrate dev --name fix_drift
```

### Performance Issues

```typescript
// Enable query logging
const db = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

// Analyze slow queries
// Add indexes as needed
```

### Data Integrity

```bash
# Validate data
npx prisma validate

# Check for orphaned records
SELECT * FROM "Note" WHERE "workspaceId" NOT IN (SELECT "id" FROM "Workspace");
```
