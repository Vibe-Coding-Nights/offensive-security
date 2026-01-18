# Memento Database Layer - Complete Setup Guide

This document provides a comprehensive guide to the Memento database architecture, setup, and usage.

## Overview

Memento uses a hybrid database architecture:
- **PostgreSQL** (via Prisma ORM) - Relational data and metadata
- **Pinecone** - Vector embeddings for AI memory similarity search

## Architecture

### Database Models

#### User Management
- **User** - User accounts with authentication
- **Session** - Session management for authentication

#### Workspace Organization
- **Workspace** - Organizational containers for notes
- **WorkspaceMember** - User membership with role-based access (OWNER, ADMIN, MEMBER, VIEWER)

#### Content
- **Note** - Rich text documents with hierarchical structure
  - Self-referential with `parentId` for nested organization
  - Stores TipTap JSON content + plain text for search
  - Supports icons, cover images, and document import tracking
- **Comment** - Note annotations with text selection anchors

#### AI System
- **Conversation** - AI chat conversation threads
- **Message** - Individual messages (USER, ASSISTANT, SYSTEM roles)
- **Memory** - AI memory fragments (metadata in PostgreSQL, vectors in Pinecone)

### Key Design Decisions

#### 1. Hierarchical Notes
Notes use a self-referential relationship for unlimited nesting:
```prisma
model Note {
  parentId String?
  parent   Note? @relation("NoteHierarchy", fields: [parentId], references: [id])
  children Note[] @relation("NoteHierarchy")
}
```

#### 2. Rich Text Storage
- **content**: JSON field storing TipTap document structure
- **contentText**: Plain text extraction for full-text search
- Enables both rich editing and efficient searching

#### 3. Hybrid Vector Storage
- **PostgreSQL**: Memory metadata (userId, workspaceId, source, timestamps)
- **Pinecone**: 1536-dimensional embeddings from OpenAI text-embedding-3-small
- Allows filtered similarity search with business logic constraints

#### 4. Intentionally Vulnerable Memory Model
The Memory model intentionally lacks security features for demonstration:

**Missing (by design):**
- `trustLevel` - All memories treated equally
- `userConfirmed` - No verification workflow
- `expiresAt` - Permanent storage
- Source validation - Any source can create memories

**Security implications:**
- Enables memory poisoning attacks
- No mechanism to distinguish trusted vs untrusted memories
- Perfect for educational/research purposes on AI security

## Files Created

### 1. Prisma Schema
**Location:** `/Users/noot/Documents/offensive-security/memento/prisma/schema.prisma`

Complete database schema with 11 models and 4 enums:
- 8 core models (User, Session, Workspace, WorkspaceMember, Note, Comment, Conversation, Message)
- 1 AI model (Memory)
- Proper indexes for performance
- Cascade delete relationships
- JSON fields for flexible data

### 2. Database Seed Script
**Location:** `/Users/noot/Documents/offensive-security/memento/prisma/seed.ts`

Creates demo data:
- 2 users (demo@memento.app, alice@memento.app)
- 1 workspace with both users
- 3 sample notes with hierarchy
- 1 comment
- 1 conversation with 4 messages
- 4 AI memories

**Demo Credentials:**
```
Email: demo@memento.app
Password: password123

Email: alice@memento.app
Password: password123
```

### 3. Prisma Client
**Location:** `/Users/noot/Documents/offensive-security/memento/src/lib/server/db/index.ts`

Singleton Prisma client with:
- Development logging (query, error, warn)
- Production logging (error only)
- Global instance prevention in development
- Type re-exports for convenience

**Usage:**
```typescript
import { db } from '$server/db';

const users = await db.user.findMany();
```

### 4. Vector Service
**Location:** `/Users/noot/Documents/offensive-security/memento/src/lib/server/services/vector.ts`

Complete Pinecone integration with:

**Core Functions:**
- `upsertMemory(memory)` - Store single memory with embedding
- `upsertMemories(memories)` - Batch store multiple memories
- `querySimilarMemories(text, options)` - Similarity search by text
- `queryByEmbedding(embedding, options)` - Search by pre-computed embedding
- `deleteMemory(memoryId)` - Remove single memory
- `deleteMemories(memoryIds)` - Batch delete
- `deleteUserMemories(userId)` - Delete all user memories
- `deleteWorkspaceMemories(workspaceId)` - Delete all workspace memories
- `getIndexStats()` - Index statistics

**Features:**
- Automatic embedding generation via OpenAI
- Filtered similarity search (userId, workspaceId, source)
- Batch operations for efficiency
- Metadata storage for context

**Usage:**
```typescript
import { upsertMemory, querySimilarMemories } from '$server/services/vector';

// Store memory
await upsertMemory(memory);

// Search memories
const results = await querySimilarMemories(
  "user's question about projects",
  {
    userId: user.id,
    workspaceId: workspace.id,
    topK: 10
  }
);
```

## Setup Instructions

### Prerequisites

1. **PostgreSQL Database**
   ```bash
   # Using Docker (recommended for development)
   docker-compose up -d

   # Manual setup
   # Install PostgreSQL 15+
   createdb memento
   ```

2. **Pinecone Account**
   - Sign up at https://www.pinecone.io
   - Create a new index with:
     - **Name:** memento-memories (or set PINECONE_INDEX_NAME)
     - **Dimensions:** 1536
     - **Metric:** Cosine
     - **Cloud:** AWS
     - **Region:** us-east-1 (or preferred)

3. **OpenAI API Key**
   - Get key from https://platform.openai.com
   - Used for text-embedding-3-small model

### Environment Configuration

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure variables:**
   ```env
   # Database
   DATABASE_URL="postgresql://memento:memento_dev@localhost:5432/memento"

   # OpenAI API
   OPENAI_API_KEY="sk-..."

   # Pinecone Vector Database
   PINECONE_API_KEY="..."
   PINECONE_INDEX_NAME="memento-memories"

   # App Configuration
   NODE_ENV="development"
   APP_URL="http://localhost:5174"

   # Session
   SESSION_SECRET="generate-with-openssl-rand-base64-32"
   ```

3. **Generate session secret:**
   ```bash
   openssl rand -base64 32
   ```

### Database Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Generate Prisma client:**
   ```bash
   pnpm db:generate
   ```

3. **Push schema to database:**
   ```bash
   pnpm db:push
   ```

   Or create a migration:
   ```bash
   pnpm db:migrate
   ```

4. **Seed demo data:**
   ```bash
   pnpm db:seed
   ```

### Verification

1. **Open Prisma Studio:**
   ```bash
   pnpm db:studio
   ```
   Visit http://localhost:5555

2. **Verify data:**
   - Check User table for demo@memento.app
   - Check Workspace table for "Personal Notes"
   - Check Note table for 3 sample notes
   - Check Memory table for 4 AI memories

3. **Test vector search:**
   ```typescript
   import { querySimilarMemories } from '$server/services/vector';

   const results = await querySimilarMemories("project planning", {
     userId: "user_id",
     topK: 5
   });

   console.log(results);
   ```

## Database Commands

### Development

```bash
# Generate Prisma client (after schema changes)
pnpm db:generate

# Push schema changes without migration
pnpm db:push

# Create migration
pnpm db:migrate

# Seed database
pnpm db:seed

# Open Prisma Studio GUI
pnpm db:studio

# Reset database (WARNING: deletes all data)
pnpm db:reset
```

### Production

```bash
# Generate client
pnpm db:generate

# Run migrations
pnpm db:migrate:deploy
```

## Common Operations

### Creating a User

```typescript
import { db } from '$server/db';
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash('password', 10);

const user = await db.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    hashedPassword,
  }
});
```

### Creating a Workspace with Member

```typescript
const workspace = await db.workspace.create({
  data: {
    name: 'My Workspace',
    slug: 'my-workspace',
    members: {
      create: {
        userId: user.id,
        role: 'OWNER',
      },
    },
  },
});
```

### Creating a Note

```typescript
const note = await db.note.create({
  data: {
    workspaceId: workspace.id,
    createdById: user.id,
    title: 'My Note',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello world!' }],
        },
      ],
    },
    contentText: 'Hello world!',
  },
});
```

### Creating a Memory with Vector

```typescript
import { db } from '$server/db';
import { upsertMemory } from '$server/services/vector';

// Create in PostgreSQL
const memory = await db.memory.create({
  data: {
    userId: user.id,
    workspaceId: workspace.id,
    content: 'User prefers dark mode',
    source: 'CONVERSATION',
    sourceId: conversation.id,
  },
});

// Store vector in Pinecone
await upsertMemory(memory);
```

### Querying with Relationships

```typescript
// Get note with all relationships
const note = await db.note.findUnique({
  where: { id: noteId },
  include: {
    createdBy: true,
    workspace: true,
    parent: true,
    children: true,
    comments: {
      include: {
        user: true,
      },
    },
  },
});

// Get user's workspaces
const workspaces = await db.workspace.findMany({
  where: {
    members: {
      some: {
        userId: user.id,
      },
    },
  },
  include: {
    members: {
      include: {
        user: true,
      },
    },
  },
});
```

### Vector Similarity Search

```typescript
import { querySimilarMemories } from '$server/services/vector';

// Search user's memories
const memories = await querySimilarMemories(
  "What are my project deadlines?",
  {
    userId: user.id,
    workspaceId: workspace.id,
    topK: 10,
  }
);

// Filter by source
const conversationMemories = await querySimilarMemories(
  "previous discussions",
  {
    userId: user.id,
    source: 'CONVERSATION',
    topK: 5,
  }
);
```

## Performance Considerations

### Indexes

The schema includes indexes on:
- `User.email` - Authentication lookups
- `Session.userId` - Session queries
- `Workspace.slug` - Workspace routing
- `WorkspaceMember.userId` - User workspace queries
- `Note.workspaceId, parentId, createdById` - Note queries
- `Comment.noteId` - Comment queries
- `Conversation.workspaceId, userId` - Conversation queries
- `Message.conversationId` - Message queries
- `Memory.userId, workspaceId, source` - Memory queries

### Query Optimization

1. **Use select to fetch only needed fields:**
   ```typescript
   const users = await db.user.findMany({
     select: { id: true, email: true, name: true },
   });
   ```

2. **Use pagination for large datasets:**
   ```typescript
   const notes = await db.note.findMany({
     where: { workspaceId },
     take: 20,
     skip: page * 20,
     orderBy: { updatedAt: 'desc' },
   });
   ```

3. **Batch vector operations:**
   ```typescript
   // Instead of:
   for (const memory of memories) {
     await upsertMemory(memory);
   }

   // Use:
   await upsertMemories(memories);
   ```

## Security Considerations

### Production Checklist

Before deploying to production, implement these security measures:

1. **Memory Trust Levels**
   ```prisma
   model Memory {
     trustLevel    Float   @default(0.5)  // 0-1 confidence score
     userConfirmed Boolean @default(false)
     verifiedAt    DateTime?
   }
   ```

2. **Memory Expiration**
   ```prisma
   model Memory {
     expiresAt DateTime?

     @@index([expiresAt])
   }
   ```

3. **Source Validation**
   - Verify sourceId exists and user has access
   - Rate limit memory creation
   - Implement approval workflow for critical memories

4. **Input Sanitization**
   - Sanitize all user inputs before storage
   - Validate TipTap content structure
   - Prevent XSS in note content

5. **Access Control**
   - Verify workspace membership before queries
   - Implement row-level security
   - Audit sensitive operations

## Troubleshooting

### Common Issues

1. **Migration conflicts:**
   ```bash
   # Reset database (development only)
   pnpm db:reset

   # Create new migration
   pnpm db:migrate
   ```

2. **Prisma client out of sync:**
   ```bash
   pnpm db:generate
   ```

3. **Pinecone connection errors:**
   - Verify API key is correct
   - Check index name matches configuration
   - Ensure index dimensions are 1536

4. **Slow queries:**
   - Check query logs in development
   - Add missing indexes
   - Use `select` to reduce data transfer
   - Implement pagination

5. **Memory sync issues:**
   - Verify both PostgreSQL and Pinecone updates succeed
   - Implement retry logic for Pinecone operations
   - Consider eventual consistency for non-critical updates

## Monitoring

### Database Health

```typescript
// Check database connection
await db.$queryRaw`SELECT 1`;

// Count records
const counts = {
  users: await db.user.count(),
  workspaces: await db.workspace.count(),
  notes: await db.note.count(),
  memories: await db.memory.count(),
};
```

### Vector Database Health

```typescript
import { getIndexStats } from '$server/services/vector';

const stats = await getIndexStats();
console.log('Vector count:', stats.totalRecordCount);
console.log('Index fullness:', stats.indexFullness);
```

## Backup and Recovery

### PostgreSQL Backup

```bash
# Backup
pg_dump -h localhost -U memento memento > backup.sql

# Restore
psql -h localhost -U memento memento < backup.sql
```

### Pinecone Backup

Pinecone doesn't support direct backups. To backup vectors:

1. Export all memories from PostgreSQL
2. Re-index from scratch if needed
3. Keep source data (notes, conversations) as source of truth

## Next Steps

1. **Implement Auth** - Add Lucia Auth v3 integration
2. **Add tRPC Routers** - Create type-safe API endpoints
3. **Build Frontend** - SvelteKit components for data display
4. **Add Real-time** - WebSocket support for collaborative editing
5. **Implement AI** - Claude integration for memory creation

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Pinecone Documentation](https://docs.pinecone.io)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [TipTap Schema](https://tiptap.dev/api/schema)

## License

MIT
