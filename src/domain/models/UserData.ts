import { User } from '@prisma/client'

export interface UserData {
  id: number
  email: string
  username: string
  createdAt: Date
  updatedAt: Date
}

export const convertToUserData = (user: User): UserData => {
  const { password, ...exceptPassword } = user
  return exceptPassword
}
