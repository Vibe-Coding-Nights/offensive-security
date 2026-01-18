import { PrismaClient, WorkspaceRole, MessageRole, MemorySource } from '@prisma/client';
import { hash } from '@node-rs/argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create demo user
  const hashedPassword = await hash('password123', {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@memento.app' },
    update: {},
    create: {
      email: 'demo@memento.app',
      name: 'Demo User',
      hashedPassword,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    },
  });

  console.log(`Created demo user: ${demoUser.email}`);

  // Create additional user for collaboration demo
  const aliceUser = await prisma.user.upsert({
    where: { email: 'alice@memento.app' },
    update: {},
    create: {
      email: 'alice@memento.app',
      name: 'Alice Johnson',
      hashedPassword: await hash('password123', {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
      }),
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    },
  });

  console.log(`Created user: ${aliceUser.email}`);

  // Create demo workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'personal-notes' },
    update: {},
    create: {
      name: 'Personal Notes',
      slug: 'personal-notes',
      settings: {
        theme: 'light',
        aiEnabled: true,
      },
      members: {
        create: [
          {
            userId: demoUser.id,
            role: WorkspaceRole.OWNER,
          },
          {
            userId: aliceUser.id,
            role: WorkspaceRole.MEMBER,
          },
        ],
      },
    },
  });

  console.log(`Created workspace: ${workspace.name}`);

  // Create sample notes with hierarchy
  const welcomeNote = await prisma.note.create({
    data: {
      workspaceId: workspace.id,
      createdById: demoUser.id,
      title: 'Welcome to Memento',
      icon: '👋',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Welcome to Memento' }],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Memento is a collaborative notes app with AI memory. Your AI assistant remembers context from your notes and conversations.',
              },
            ],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Key Features' }],
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Rich text editing with TipTap' }],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Hierarchical note organization' }],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'AI assistant with persistent memory' }],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Real-time collaboration' }],
                  },
                ],
              },
            ],
          },
        ],
      },
      contentText: 'Welcome to Memento. Memento is a collaborative notes app with AI memory. Your AI assistant remembers context from your notes and conversations. Key Features: Rich text editing with TipTap, Hierarchical note organization, AI assistant with persistent memory, Real-time collaboration.',
    },
  });

  console.log(`Created note: ${welcomeNote.title}`);

  // Create child note under welcome
  const gettingStartedNote = await prisma.note.create({
    data: {
      workspaceId: workspace.id,
      createdById: demoUser.id,
      parentId: welcomeNote.id,
      title: 'Getting Started Guide',
      icon: '🚀',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Getting Started' }],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Create your first note by clicking the + button in the sidebar.',
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [{ type: 'bold' }],
                text: 'Pro tip:',
              },
              {
                type: 'text',
                text: ' Use the AI assistant to help organize and summarize your notes.',
              },
            ],
          },
        ],
      },
      contentText: 'Getting Started. Create your first note by clicking the + button in the sidebar. Pro tip: Use the AI assistant to help organize and summarize your notes.',
    },
  });

  console.log(`Created note: ${gettingStartedNote.title}`);

  // Create a project planning note
  const projectNote = await prisma.note.create({
    data: {
      workspaceId: workspace.id,
      createdById: demoUser.id,
      title: 'Q1 2026 Project Ideas',
      icon: '💡',
      coverUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Q1 2026 Project Ideas' }],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'High Priority' }],
          },
          {
            type: 'taskList',
            content: [
              {
                type: 'taskItem',
                attrs: { checked: false },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Launch mobile app beta' }],
                  },
                ],
              },
              {
                type: 'taskItem',
                attrs: { checked: false },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Implement offline sync' }],
                  },
                ],
              },
              {
                type: 'taskItem',
                attrs: { checked: true },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Set up CI/CD pipeline' }],
                  },
                ],
              },
            ],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Research' }],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Explore vector database options for improved AI memory retrieval.',
              },
            ],
          },
        ],
      },
      contentText: 'Q1 2026 Project Ideas. High Priority: Launch mobile app beta, Implement offline sync, Set up CI/CD pipeline. Research: Explore vector database options for improved AI memory retrieval.',
    },
  });

  console.log(`Created note: ${projectNote.title}`);

  // Create a comment on the project note
  const comment = await prisma.comment.create({
    data: {
      noteId: projectNote.id,
      userId: aliceUser.id,
      content: 'Great ideas! I think the mobile app should be our top priority.',
      selection: {
        anchor: 0,
        head: 20,
      },
    },
  });

  console.log(`Created comment by ${aliceUser.name}`);

  // Create a sample conversation
  const conversation = await prisma.conversation.create({
    data: {
      workspaceId: workspace.id,
      userId: demoUser.id,
      title: 'Planning Q1 Projects',
      messages: {
        create: [
          {
            role: MessageRole.USER,
            content: 'Can you help me organize my Q1 project ideas?',
            metadata: {},
          },
          {
            role: MessageRole.ASSISTANT,
            content: 'I\'d be happy to help you organize your Q1 projects! Based on your notes, I can see you\'re considering a mobile app beta, offline sync, and CI/CD pipeline. Let me help you prioritize these.\n\nFrom what I understand:\n1. Mobile app beta - This seems like a customer-facing feature that could drive growth\n2. Offline sync - Critical for mobile experience\n3. CI/CD pipeline - Already completed!\n\nWould you like me to help create a timeline for these projects?',
            metadata: {
              referencedNotes: [projectNote.id],
            },
          },
          {
            role: MessageRole.USER,
            content: 'Yes, that would be great. What timeline do you suggest?',
            metadata: {},
          },
          {
            role: MessageRole.ASSISTANT,
            content: 'Based on typical development cycles, here\'s a suggested timeline:\n\nWeeks 1-4: Mobile App Beta\n- Week 1-2: Core UI/UX implementation\n- Week 3: Testing and bug fixes\n- Week 4: Beta release to select users\n\nWeeks 5-10: Offline Sync\n- Week 5-6: Architecture and data model design\n- Week 7-9: Implementation\n- Week 10: Testing and edge cases\n\nThis gives you the full Q1 to complete both high-priority items. The CI/CD pipeline you\'ve already completed will help accelerate deployments!\n\nShould I create a detailed project note with these milestones?',
            metadata: {
              referencedNotes: [projectNote.id],
            },
          },
        ],
      },
    },
  });

  console.log(`Created conversation: ${conversation.title}`);

  // Create sample memories (these would normally be created by the AI during conversations)
  const memories = await prisma.memory.createMany({
    data: [
      {
        userId: demoUser.id,
        workspaceId: workspace.id,
        content: 'User is planning Q1 2026 projects including mobile app beta and offline sync',
        source: MemorySource.CONVERSATION,
        sourceId: conversation.id,
      },
      {
        userId: demoUser.id,
        workspaceId: workspace.id,
        content: 'User has already completed CI/CD pipeline setup',
        source: MemorySource.NOTE,
        sourceId: projectNote.id,
      },
      {
        userId: demoUser.id,
        workspaceId: workspace.id,
        content: 'User prefers structured task lists for project planning',
        source: MemorySource.CONVERSATION,
        sourceId: conversation.id,
      },
      {
        userId: demoUser.id,
        workspaceId: workspace.id,
        content: 'Team member Alice Johnson suggested mobile app as top priority',
        source: MemorySource.NOTE,
        sourceId: projectNote.id,
      },
    ],
  });

  console.log(`Created ${memories.count} AI memories`);

  // Create a session for the demo user (7 days expiry)
  const session = await prisma.session.create({
    data: {
      userId: demoUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  console.log(`Created session for demo user (expires in 7 days)`);

  console.log('\n✅ Database seed completed successfully!');
  console.log('\nDemo credentials:');
  console.log('Email: demo@memento.app');
  console.log('Password: password123');
  console.log('\nAdditional user:');
  console.log('Email: alice@memento.app');
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
