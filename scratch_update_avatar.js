const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.teamMember.update({
    where: { id: 'cmtopofof0001ao4ev2xkm350' },
    data: { avatarUrl: '' }
  });
  console.log('Updated Rishikesh avatar to empty string');
}
main().catch(console.error).finally(() => prisma.$disconnect());
