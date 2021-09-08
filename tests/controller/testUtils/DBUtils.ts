import prismaClient from '../../../src/infrastructure/repository/prismaClient'

export const clearDB = async () => {
  const prisma = prismaClient
  const delPost = prisma.post.deleteMany({})
  const delUser = prisma.user.deleteMany({})
  await prisma.$transaction([delPost, delUser])
}
