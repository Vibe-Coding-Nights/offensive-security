# Memento

A collaborative notes app with AI-powered memory. Memento learns from your notes and proactively surfaces relevant context when you need it.

## Features

- **Rich Text Editing**: Powered by TipTap with collaborative editing support
- **AI Memory**: Intelligent context retrieval using vector embeddings
- **Real-time Collaboration**: Multiple users can edit notes simultaneously
- **Smart Import**: Import from DOCX, HTML, and other formats
- **Contextual Awareness**: AI surfaces relevant notes automatically

## Tech Stack

- **Frontend**: SvelteKit 2, Svelte 5, TailwindCSS
- **Backend**: tRPC, Prisma, PostgreSQL
- **AI**: Anthropic Claude, OpenAI Embeddings, Pinecone
- **Collaboration**: Yjs, WebSockets
- **Auth**: Lucia Auth v3

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

### Setup

1. **Clone and install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start infrastructure**:
   ```bash
   docker-compose up -d
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Generate auth secret**:
   ```bash
   openssl rand -base64 32
   # Add to AUTH_SECRET in .env
   ```

5. **Setup database**:
   ```bash
   pnpm db:push
   ```

6. **Start development server**:
   ```bash
   pnpm dev
   ```

Visit http://localhost:5173

## Development Commands

```bash
# Development
pnpm dev                 # Start dev server
pnpm build              # Build for production
pnpm preview            # Preview production build

# Database
pnpm db:generate        # Generate Prisma client
pnpm db:push            # Push schema changes
pnpm db:migrate         # Create migration
pnpm db:studio          # Open Prisma Studio

# Code Quality
pnpm check              # Type check
pnpm lint               # Lint code
pnpm format             # Format code
```

## Database Services

- **PostgreSQL**: localhost:5432
  - User: `memento`
  - Password: `memento_dev`
  - Database: `memento`

- **Redis**: localhost:6379
  - Used for job queues and caching

## API Keys Required

1. **Anthropic API Key**: For Claude AI features
2. **OpenAI API Key**: For text embeddings
3. **Pinecone API Key**: For vector storage

Get your API keys:
- Anthropic: https://console.anthropic.com
- OpenAI: https://platform.openai.com
- Pinecone: https://www.pinecone.io

## Production Deployment

Build the Docker image:

```bash
docker build -t memento:latest .
```

Run with production environment variables configured.

## Architecture

```
memento/
├── src/
│   ├── lib/
│   │   ├── components/     # Svelte components
│   │   ├── server/         # Backend logic
│   │   │   ├── ai/         # AI integrations
│   │   │   ├── db/         # Prisma client
│   │   │   └── trpc/       # tRPC routers
│   │   ├── stores/         # Svelte stores
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilities
│   └── routes/             # SvelteKit routes
├── prisma/
│   └── schema.prisma       # Database schema
└── docker-compose.yml      # Local infrastructure
```

## License

MIT
