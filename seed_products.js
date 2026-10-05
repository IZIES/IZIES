const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.iziesProduct.count();
  if (existing > 0) { console.log('Products already exist:', existing); return; }
  
  await prisma.iziesProduct.createMany({
    data: [
      {
        name: 'Project Hub',
        tagline: 'Build. Share. Grow.',
        description: 'The place where college students upload their projects, get real feedback, and find people to build with — without the noise. Discover new ideas, collaborate with peers, and get mentored by industry experts.',
        type: 'Free · Open Platform',
        status: 'live',
        url: 'https://projecthub.izies.in',
        imageUrl: null,
        iconName: 'Rocket',
        color: 'violet',
        tags: ['Students', 'Collaboration', 'Open Source', 'Free Forever'],
        isFeatured: true,
        order: 1,
        isPublic: true,
      },
      {
        name: 'Clone',
        tagline: 'Your Virtual HQ.',
        description: 'Create virtual office spaces, invite teammates, and customize rooms, desks, chat, video and map objects. A pixel-art virtual world for remote teams and communities — reimagining how people collaborate online.',
        type: 'Free · Early Access',
        status: 'beta',
        url: 'https://metaver.izies.in',
        imageUrl: null,
        iconName: 'Globe',
        color: 'indigo',
        tags: ['Virtual Office', 'Remote Teams', 'Metaverse', 'Pixel Art'],
        isFeatured: false,
        order: 2,
        isPublic: true,
      }
    ]
  });
  console.log('Products seeded successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
