import * as z from 'zod'
import { UserData } from '../../../domain/models/UserData'

export const LoginBodyValidation = z.object({
  username: z.string().max(100),
  password: z.string().max(20),
})

export type LoginBody = {
  username: string
  password: string
}

export type LoginResult = {
  user: UserData
  token: string
}
