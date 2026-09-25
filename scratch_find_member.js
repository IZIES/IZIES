const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const member = await prisma.teamMember.findFirst({
    where: { avatarUrl: { contains: '15178419240' } }
  });
  console.log(member);
}
main().catch(console.error).finally(() => prisma.$disconnect());
