import { Post } from '@prisma/client'
import * as z from 'zod'

export const UserPostParamsValidation = z.object({
  username: z.string().max(200),
})

export type UserPostParams = {
  username: string
}

export type UserPostResult = {
  posts: Post[]
}
