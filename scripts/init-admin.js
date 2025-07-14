const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const email = 'admin@partytrack.com'
    const password = 'admin123'
    
    // 检查是否已存在管理员
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('管理员账号已存在:', email)
      return
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const admin = await prisma.user.create({
      data: {
        name: '系统管理员',
        email,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('管理员账号创建成功:')
    console.log('邮箱:', email)
    console.log('密码:', password)
    console.log('角色: ADMIN')

  } catch (error) {
    console.error('创建管理员账号失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()