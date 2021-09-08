import { Post } from '@prisma/client'
import * as z from 'zod'

export const PostsQueryValidation = z.object({
  page: z
    .string()
    .refine((v) => {
      return !isNaN(Number(v))
    }, 'error message')
    .transform((v) => {
      return Number(v)
    }),
})

export type PostsQuery = {
  page: string
}

export type PostsResult = {
  posts: Post[]
}
