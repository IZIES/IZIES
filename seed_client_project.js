const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.clientProject.count();
  if (existing > 0) { console.log('Client projects already exist'); return; }
  
  await prisma.clientProject.create({
    data: {
      name: 'E-commerce Overhaul',
      clientName: 'Nexus Retail',
      industry: 'Retail & E-commerce',
      description: 'A complete digital transformation of an enterprise e-commerce platform, handling 50k+ daily active users with sub-second page loads.',
      techStack: ['Next.js', 'PostgreSQL', 'Tailwind', 'AWS'],
      services: ['Full-stack Development', 'Cloud Architecture'],
      isFeatured: true,
      order: 1,
      isPublic: true,
    }
  });
  console.log('Dummy client project seeded successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
