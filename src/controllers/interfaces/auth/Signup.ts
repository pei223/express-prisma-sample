import * as z from 'zod'
import { UserData } from '../../../domain/models/UserData'

export type SignUpBody = {
  username: string
  email: string
  password: string
}

export const SignUpValidation = z.object({
  username: z.string().max(100),
  email: z.string().max(100),
  password: z.string().max(20),
})

export type SignupRes = {
  user: UserData
}
