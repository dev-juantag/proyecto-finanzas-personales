const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  try {
    console.log('Intentando conectar con DATABASE_URL...');
    const categories = await prisma.category.findMany({ take: 1 });
    console.log('Conexión exitosa. Categorías encontradas:', categories.length);
  } catch (e) {
    console.error('Error de conexión:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
