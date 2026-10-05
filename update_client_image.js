const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  await prisma.clientProject.updateMany({
    where: { name: 'E-commerce Overhaul' },
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop'
    }
  });
  console.log('Image added to client project!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
