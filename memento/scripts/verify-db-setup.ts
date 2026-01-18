#!/usr/bin/env tsx
/**
 * Database Setup Verification Script
 *
 * Verifies that the Memento database layer is correctly configured.
 * Run with: tsx scripts/verify-db-setup.ts
 */

import { PrismaClient } from '@prisma/client';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { join } from 'path';

const db = new PrismaClient();

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

const results: CheckResult[] = [];

function logResult(result: CheckResult) {
  results.push(result);
  const icon = result.status === 'pass' ? '✓' : result.status === 'fail' ? '✗' : '⚠';
  const color = result.status === 'pass' ? '\x1b[32m' : result.status === 'fail' ? '\x1b[31m' : '\x1b[33m';
  console.log(`${color}${icon}\x1b[0m ${result.name}: ${result.message}`);
}

async function checkEnvironmentVariables() {
  console.log('\n📋 Checking Environment Variables...\n');

  const requiredVars = [
    'DATABASE_URL',
    'OPENAI_API_KEY',
    'PINECONE_API_KEY',
    'PINECONE_INDEX_NAME',
  ];

  for (const varName of requiredVars) {
    if (process.env[varName]) {
      logResult({
        name: varName,
        status: 'pass',
        message: 'Set'
      });
    } else {
      logResult({
        name: varName,
        status: 'fail',
        message: 'Not set - required for full functionality'
      });
    }
  }

  const optionalVars = ['SESSION_SECRET', 'NODE_ENV'];
  for (const varName of optionalVars) {
    if (process.env[varName]) {
      logResult({
        name: varName,
        status: 'pass',
        message: 'Set'
      });
    } else {
      logResult({
        name: varName,
        status: 'warn',
        message: 'Not set - optional but recommended'
      });
    }
  }
}

async function checkDatabaseConnection() {
  console.log('\n🗄️  Checking Database Connection...\n');

  try {
    await db.$queryRaw`SELECT 1`;
    logResult({
      name: 'PostgreSQL Connection',
      status: 'pass',
      message: 'Connected successfully'
    });
  } catch (error) {
    logResult({
      name: 'PostgreSQL Connection',
      status: 'fail',
      message: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    return false;
  }

  return true;
}

async function checkDatabaseSchema() {
  console.log('\n📐 Checking Database Schema...\n');

  const tables = [
    'User',
    'Session',
    'Workspace',
    'WorkspaceMember',
    'Note',
    'Comment',
    'Conversation',
    'Message',
    'Memory'
  ];

  for (const table of tables) {
    try {
      // @ts-ignore - Dynamic table access
      await db[table.charAt(0).toLowerCase() + table.slice(1)].count();
      logResult({
        name: `${table} table`,
        status: 'pass',
        message: 'Exists and accessible'
      });
    } catch (error) {
      logResult({
        name: `${table} table`,
        status: 'fail',
        message: 'Missing or inaccessible - run migrations'
      });
    }
  }
}

async function checkSeedData() {
  console.log('\n🌱 Checking Seed Data...\n');

  try {
    const userCount = await db.user.count();
    logResult({
      name: 'Users',
      status: userCount > 0 ? 'pass' : 'warn',
      message: `${userCount} users found${userCount === 0 ? ' - run seed script' : ''}`
    });

    const workspaceCount = await db.workspace.count();
    logResult({
      name: 'Workspaces',
      status: workspaceCount > 0 ? 'pass' : 'warn',
      message: `${workspaceCount} workspaces found${workspaceCount === 0 ? ' - run seed script' : ''}`
    });

    const noteCount = await db.note.count();
    logResult({
      name: 'Notes',
      status: noteCount > 0 ? 'pass' : 'warn',
      message: `${noteCount} notes found${noteCount === 0 ? ' - run seed script' : ''}`
    });

    const memoryCount = await db.memory.count();
    logResult({
      name: 'Memories',
      status: memoryCount > 0 ? 'pass' : 'warn',
      message: `${memoryCount} memories found${memoryCount === 0 ? ' - run seed script' : ''}`
    });

    // Check for demo user
    const demoUser = await db.user.findUnique({
      where: { email: 'demo@memento.app' }
    });

    logResult({
      name: 'Demo User',
      status: demoUser ? 'pass' : 'warn',
      message: demoUser ? 'demo@memento.app exists' : 'Not found - run seed script'
    });
  } catch (error) {
    logResult({
      name: 'Seed Data',
      status: 'fail',
      message: `Error checking data: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}

async function checkPineconeConnection() {
  console.log('\n🌲 Checking Pinecone Connection...\n');

  if (!process.env.PINECONE_API_KEY) {
    logResult({
      name: 'Pinecone API Key',
      status: 'fail',
      message: 'PINECONE_API_KEY not set'
    });
    return false;
  }

  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY
    });

    const indexName = process.env.PINECONE_INDEX_NAME || 'memento-memories';
    const index = pinecone.index(indexName);

    const stats = await index.describeIndexStats();

    logResult({
      name: 'Pinecone Connection',
      status: 'pass',
      message: `Connected to index: ${indexName}`
    });

    logResult({
      name: 'Vector Count',
      status: 'pass',
      message: `${stats.totalRecordCount || 0} vectors stored`
    });

    logResult({
      name: 'Index Dimensions',
      status: stats.dimension === 1536 ? 'pass' : 'fail',
      message: `${stats.dimension || 'unknown'} (expected 1536 for text-embedding-3-small)`
    });

    return true;
  } catch (error) {
    logResult({
      name: 'Pinecone Connection',
      status: 'fail',
      message: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    return false;
  }
}

async function checkOpenAIConnection() {
  console.log('\n🤖 Checking OpenAI Connection...\n');

  if (!process.env.OPENAI_API_KEY) {
    logResult({
      name: 'OpenAI API Key',
      status: 'fail',
      message: 'OPENAI_API_KEY not set'
    });
    return false;
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: 'test'
    });

    logResult({
      name: 'OpenAI Connection',
      status: 'pass',
      message: 'Embedding API accessible'
    });

    logResult({
      name: 'Embedding Dimensions',
      status: response.data[0].embedding.length === 1536 ? 'pass' : 'fail',
      message: `${response.data[0].embedding.length} dimensions`
    });

    return true;
  } catch (error) {
    logResult({
      name: 'OpenAI Connection',
      status: 'fail',
      message: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    return false;
  }
}

async function checkFileStructure() {
  console.log('\n📁 Checking File Structure...\n');

  const requiredFiles = [
    'prisma/schema.prisma',
    'prisma/seed.ts',
    'src/lib/server/db/index.ts',
    'src/lib/server/services/vector.ts',
  ];

  for (const file of requiredFiles) {
    try {
      const fullPath = join(process.cwd(), file);
      readFileSync(fullPath, 'utf8');
      logResult({
        name: file,
        status: 'pass',
        message: 'Exists'
      });
    } catch (error) {
      logResult({
        name: file,
        status: 'fail',
        message: 'Missing or unreadable'
      });
    }
  }
}

async function main() {
  console.log('\n╔═══════════════════════════════════════════════╗');
  console.log('║   Memento Database Setup Verification        ║');
  console.log('╚═══════════════════════════════════════════════╝');

  await checkFileStructure();
  await checkEnvironmentVariables();

  const dbConnected = await checkDatabaseConnection();
  if (dbConnected) {
    await checkDatabaseSchema();
    await checkSeedData();
  }

  await checkPineconeConnection();
  await checkOpenAIConnection();

  // Summary
  console.log('\n╔═══════════════════════════════════════════════╗');
  console.log('║   Summary                                     ║');
  console.log('╚═══════════════════════════════════════════════╝\n');

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warned = results.filter(r => r.status === 'warn').length;
  const total = results.length;

  console.log(`Total Checks: ${total}`);
  console.log(`\x1b[32m✓ Passed: ${passed}\x1b[0m`);
  console.log(`\x1b[31m✗ Failed: ${failed}\x1b[0m`);
  console.log(`\x1b[33m⚠ Warnings: ${warned}\x1b[0m`);

  if (failed === 0) {
    console.log('\n\x1b[32m✓ All critical checks passed!\x1b[0m');
    console.log('\nYour database layer is ready to use.');
    console.log('\nNext steps:');
    console.log('1. pnpm dev - Start development server');
    console.log('2. Visit http://localhost:5173');
    console.log('3. Login with demo@memento.app / password123');
  } else {
    console.log('\n\x1b[31m✗ Some checks failed.\x1b[0m');
    console.log('\nPlease fix the issues above and run again.');
    console.log('\nCommon fixes:');
    console.log('1. cp .env.example .env - Copy environment template');
    console.log('2. Edit .env with your API keys');
    console.log('3. pnpm db:push - Push database schema');
    console.log('4. pnpm db:seed - Seed demo data');
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error('\n\x1b[31mFatal error:\x1b[0m', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
