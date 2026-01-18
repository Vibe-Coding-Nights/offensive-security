#!/usr/bin/env node

/**
 * DevKit MCP Server
 * Developer productivity tools for AI coding assistants
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { tools } from './tools/index.js';
import { handleToolCall } from './handlers/index.js';

async function main() {
  const server = new Server(
    {
      name: 'devkit-mcp',
      version: '1.2.3',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tool listing
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
  });

  // Register tool execution
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const result = await handleToolCall(name, args as Record<string, unknown>);
    return {
      content: [{ type: 'text', text: result }],
    };
  });

  // Start server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('[devkit-mcp] Server running on stdio');
}

main().catch((error) => {
  console.error('[devkit-mcp] Fatal error:', error);
  process.exit(1);
});
