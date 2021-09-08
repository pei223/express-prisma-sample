import { Post } from '@prisma/client'
import { Request, Response } from 'express'
import { systemLogger, accessLogger } from '../../infrastructure/logger/Log'
import PostRepo from '../../infrastructure/repository/PostRepository'
import UserRepo from '../../infrastructure/repository/UserRepository'
import { UserPayloadData } from '../auth/JsonWebToken'
import { ApiCode, HttpStatus } from '../common/ApiConsts'
import {
  ErrorCategory,
  ErrorResponse,
  genErrCode,
  genErrorRes,
} from '../common/Error'
import {
  PostIdParams,
  PostIdValidation,
  PostValidation,
} from '../interfaces/posts/Common'

export const UpdatePost = async (
  req: Request<PostIdParams, any, Post>,
  res: Response<Post | ErrorResponse>,
  payload: UserPayloadData
) => {
  accessLogger.info('Access UpdatePost')
  let parsedPost
  let parsedParams
  try {
    parsedParams = PostIdValidation.parse(req.params)
    parsedPost = PostValidation.parse(req.body)
  } catch (e) {
    const errorCode = genErrCode(ApiCode.UpdatePost, ErrorCategory.InvalidArgs)
    res.status(HttpStatus.BadRequest).send(genErrorRes(errorCode))
    return
  }

  const repo = new PostRepo()

  const postId = parsedParams.id

  try {
    const user = await new UserRepo().getUser(payload.username)
    if (!(await repo.isMyPost(postId, user.id))) {
      const errorCode = genErrCode(
        ApiCode.UpdatePost,
        ErrorCategory.NoAuthority
      )
      systemLogger.warn(`Access post data with other user: ${payload.username}`)
      res.status(HttpStatus.BadRequest).send(genErrorRes(errorCode))
      return
    }

    const post = await repo.update(postId, parsedPost.title, parsedPost.content)
    res.status(200).send(post)
  } catch (e) {
    systemLogger.error(e)
    const errorCode = genErrCode(ApiCode.UpdatePost, ErrorCategory.Unexpected)
    res.status(HttpStatus.InternalErr).send(genErrorRes(errorCode))
  }
}
