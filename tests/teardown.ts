import prismaClient from '../src/infrastructure/repository/prismaClient'
import { clearDB } from './controller/testUtils/DBUtils'

export default async () => {
  await clearDB()
  await prismaClient.$disconnect()
}
