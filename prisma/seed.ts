import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@contador.com'
  const adminPassword = 'adminpassword123'
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: Role.SUPERADMIN,
      }
    })
    console.log('Super Admin created successfully. Email: admin@contador.com / Password: adminpassword123')
  } else {
    console.log('Super Admin already exists.')
  }

  // Creación de categorías por defecto
  const defaultCategories = [
    { name: 'Salario', type: 'INCOME', icon: 'Wallet' },
    { name: 'Inversiones', type: 'INCOME', icon: 'TrendingUp' },
    { name: 'Alimentación', type: 'EXPENSE', icon: 'Utensils' },
    { name: 'Transporte', type: 'EXPENSE', icon: 'Car' },
    { name: 'Vivienda', type: 'EXPENSE', icon: 'Home' },
    { name: 'Ocio', type: 'EXPENSE', icon: 'Coffee' },
  ] as const

  for (const cat of defaultCategories) {
    const existingCat = await prisma.category.findFirst({
      where: { name: cat.name, userId: null }
    })
    
    if (!existingCat) {
      await prisma.category.create({
        data: {
          name: cat.name,
          type: cat.type,
          icon: cat.icon,
          // userId es null para categorías del sistema
        }
      })
    }
  }
  console.log('Default categories created.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
