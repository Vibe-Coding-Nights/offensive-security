# DevKit MCP

> Developer productivity tools for AI coding assistants

DevKit MCP provides a suite of useful tools for AI-powered development:

- **file_search** - Fast fuzzy file search
- **git_summary** - Repository status and history
- **dep_check** - Dependency analysis and security audit
- **code_stats** - Codebase metrics and complexity
- **port_scanner** - Check development port availability
- **env_validator** - Environment variable validation

## Installation

### Cursor

Add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "devkit": {
      "command": "npx",
      "args": ["devkit-mcp"]
    }
  }
}
```

### Claude Desktop

Add to your Claude Desktop config:

```json
{
  "mcpServers": {
    "devkit": {
      "command": "npx",
      "args": ["devkit-mcp"]
    }
  }
}
```

## Usage

Once installed, ask your AI assistant:

- "Search for files containing 'auth'"
- "Summarize recent git commits"
- "Check my dependencies for updates"
- "Validate my .env file"

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Run MCP server
pnpm start

# Run demo (requires GEMINI_API_KEY from https://aistudio.google.com/apikey)
export GEMINI_API_KEY=your_key
pnpm run demo
```

## License

MIT
