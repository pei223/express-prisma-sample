import * as z from 'zod'
import { Post } from '.prisma/client'

export const PostValidation = z.object({
  title: z.string().max(200),
  content: z.string().max(2000),
})

export const PostIdValidation = z.object({
  id: z
    .string()
    .refine((v) => {
      return !isNaN(Number(v))
    }, 'error message')
    .transform((v) => {
      return Number(v)
    }),
})

export type PostIdParams = {
  id: number
}

export type FindPostRes = {
  post: Post
}
