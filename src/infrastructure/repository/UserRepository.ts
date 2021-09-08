import { convertToUserData, UserData } from '../../domain/models/UserData'
import BaseRepository from './BaseRepository'

export default class UserRepo extends BaseRepository {
  bcrypt = require('bcrypt')
  readonly passwordHashStretch: number
  readonly passwordSalt: string

  constructor() {
    super()
    this.passwordHashStretch = Number(process.env.PASSWORD_HASH_STRETCH)
    this.passwordSalt = process.env.PASSWORD_SALT
  }

  async add(user: {
    email: string
    username: string
    password: string
  }): Promise<UserData> {
    const salt = this.passwordSalt
    const hashedPassword = this.bcrypt.hashSync(user.password, 10)
    // const hashedPassword = this.bcrypt.hashSync(user.password + salt, 10)
    user.password = hashedPassword
    const createdUser = await this.prisma.user.create({
      data: user,
    })
    return convertToUserData(createdUser)
  }

  async isEmailUnique(email: string): Promise<boolean> {
    const cnt = await this.prisma.user.count({
      where: {
        email: email,
      },
    })
    return cnt === 0
  }

  async isUserNameUnique(username: string): Promise<boolean> {
    const cnt = await this.prisma.user.count({
      where: {
        username: username,
      },
    })
    return cnt === 0
  }

  async loginUser(
    userName: string,
    password: string
  ): Promise<UserData | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        username: userName,
      },
    })
    if (!user) {
      return null
    }
    return this.bcrypt.compareSync(password, user.password)
      ? // return this.bcrypt.compareSync(password + this.passwordSalt, user.password)
        convertToUserData(user)
      : null
  }

  async getUser(userName: string): Promise<UserData | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        username: userName,
      },
    })
    return !user ? null : convertToUserData(user)
  }
}
