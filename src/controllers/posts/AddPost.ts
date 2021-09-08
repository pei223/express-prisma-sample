import { Post } from '@prisma/client'
import { Request, Response } from 'express'
import { accessLogger, systemLogger } from '../../infrastructure/logger/Log'
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
import { AddPostRes } from '../interfaces/posts/AddPost'
import { PostValidation } from '../interfaces/posts/Common'

export const AddPost = async (
  req: Request<any, any, Post>,
  res: Response<AddPostRes | ErrorResponse>,
  payload: UserPayloadData
) => {
  accessLogger.info('Access AddPost')

  try {
    PostValidation.parse(req.body)
  } catch (e) {
    const errorCode = genErrCode(ApiCode.AddPost, ErrorCategory.InvalidArgs)
    res.status(HttpStatus.BadRequest).send(genErrorRes(errorCode))
    return
  }

  const repo = new PostRepo()
  try {
    const user = await new UserRepo().getUser(payload.username)
    if (!user) {
      systemLogger.warn(`${payload.username} is not exist.`)
      const errorCode = genErrCode(ApiCode.AddPost, ErrorCategory.AuthErr)
      res.status(HttpStatus.Unauthorized).send(genErrorRes(errorCode))
      return
    }
    const post = await repo.add({ ...req.body, authorId: user.id })
    res.status(200).send({ post: post })
  } catch (e) {
    systemLogger.error(e)
    const errorCode = genErrCode(ApiCode.AddPost, ErrorCategory.Unexpected)
    res.status(HttpStatus.InternalErr).send(genErrorRes(errorCode))
  }
}
