import { PrismaClient } from '@prisma/client'
import prismaClient from './prismaClient'

export default class BaseRepository {
  prisma: PrismaClient = prismaClient

  disconnect() {
    this.prisma.$disconnect()
  }
}
