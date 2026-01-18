# Memento Database - Quick Start

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL database
- Pinecone account
- OpenAI API key

## Setup (5 minutes)

### 1. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with:
```env
DATABASE_URL="postgresql://memento:memento_dev@localhost:5432/memento"
OPENAI_API_KEY="sk-..."
PINECONE_API_KEY="..."
PINECONE_INDEX_NAME="memento-memories"
```

### 2. Pinecone Index

Create index at https://app.pinecone.io:
- **Name**: `memento-memories`
- **Dimensions**: `1536`
- **Metric**: `Cosine`
- **Cloud**: AWS
- **Region**: us-east-1

### 3. Database Setup

```bash
pnpm install           # Install dependencies
pnpm db:generate       # Generate Prisma client
pnpm db:push           # Push schema to database
pnpm db:seed           # Seed demo data
```

### 4. Verify Setup

```bash
tsx scripts/verify-db-setup.ts
```

Or manually:
```bash
pnpm db:studio  # Opens Prisma Studio on localhost:5555
```

### 5. Start Development

```bash
pnpm dev
# Visit http://localhost:5173
# Login: demo@memento.app / password123
```

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| demo@memento.app | password123 | OWNER |
| alice@memento.app | password123 | MEMBER |

## File Locations

```
memento/
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Seed script
├── src/lib/server/
│   ├── db/index.ts                # Prisma client
│   └── services/vector.ts         # Pinecone service
├── DATABASE_SETUP.md              # Detailed setup guide
├── DATABASE_COMPLETE.md           # Implementation summary
└── docs/DATABASE_SCHEMA.md        # Schema reference
```

## Common Commands

```bash
# Database
pnpm db:generate       # Generate Prisma client
pnpm db:push           # Push schema changes
pnpm db:migrate        # Create migration
pnpm db:seed           # Seed demo data
pnpm db:studio         # Open Prisma Studio

# Development
pnpm dev               # Start dev server
pnpm build             # Build for production
pnpm preview           # Preview production build

# Verification
tsx scripts/verify-db-setup.ts    # Verify setup
```

## Database Models

### Core
- **User** - User accounts
- **Session** - Authentication sessions
- **Workspace** - Organizational containers
- **WorkspaceMember** - Role-based membership

### Content
- **Note** - Hierarchical documents with TipTap content
- **Comment** - Note annotations

### AI
- **Conversation** - Chat threads
- **Message** - Individual messages
- **Memory** - AI memory fragments (PostgreSQL + Pinecone)

## Quick Usage Examples

### Create a Note

```typescript
import { db } from '$server/db';

const note = await db.note.create({
  data: {
    workspaceId: workspace.id,
    createdById: user.id,
    title: 'My Note',
    content: {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Hello!' }] }
      ]
    },
    contentText: 'Hello!'
  }
});
```

### Store AI Memory

```typescript
import { db } from '$server/db';
import { upsertMemory } from '$server/services/vector';

const memory = await db.memory.create({
  data: {
    userId: user.id,
    workspaceId: workspace.id,
    content: 'User prefers dark mode',
    source: 'CONVERSATION'
  }
});

await upsertMemory(memory);
```

### Search Memories

```typescript
import { querySimilarMemories } from '$server/services/vector';

const results = await querySimilarMemories(
  "What are my preferences?",
  { userId: user.id, topK: 10 }
);
```

## Troubleshooting

### Database connection failed
```bash
# Check PostgreSQL is running
docker-compose up -d

# Verify DATABASE_URL in .env
```

### Prisma client out of sync
```bash
pnpm db:generate
```

### Pinecone connection error
- Verify API key is correct
- Check index name matches PINECONE_INDEX_NAME
- Ensure index dimensions are 1536

### No demo data
```bash
pnpm db:seed
```

## Next Steps

1. Review [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed documentation
2. Check [docs/DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md) for schema reference
3. Start building your application with the database layer

## Support

- Documentation: See DATABASE_SETUP.md
- Schema Reference: See docs/DATABASE_SCHEMA.md
- Prisma Docs: https://www.prisma.io/docs
- Pinecone Docs: https://docs.pinecone.io

---

**Status**: Database layer complete and ready for integration
**Working Directory**: `/Users/noot/Documents/offensive-security/memento`
