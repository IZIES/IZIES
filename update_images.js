const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.iziesProduct.updateMany({
    where: { name: 'Project Hub' },
    data: {
      imageUrl: '/product/projecthub.png'
    }
  });

  await prisma.iziesProduct.updateMany({
    where: { name: 'Clone' },
    data: {
      imageUrl: '/product/metaverse.png'
    }
  });
  console.log('Images updated to local paths!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
