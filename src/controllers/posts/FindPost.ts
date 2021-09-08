import { Post } from '@prisma/client'
import { Request, Response } from 'express'
import { accessLogger, systemLogger } from '../../infrastructure/logger/Log'
import PostRepo from '../../infrastructure/repository/PostRepository'
import { ApiCode, HttpStatus } from '../common/ApiConsts'
import {
  ErrorCategory,
  ErrorResponse,
  genErrCode,
  genErrorRes,
} from '../common/Error'
import {
  FindPostRes,
  PostIdParams,
  PostIdValidation,
} from '../interfaces/posts/Common'

export const FindPost = async (
  req: Request<PostIdParams>,
  res: Response<FindPostRes | ErrorResponse>
) => {
  accessLogger.info('Access FindPost')

  let parsedParams
  try {
    parsedParams = PostIdValidation.parse(req.params)
  } catch (e) {
    const errorCode = genErrCode(ApiCode.FindPost, ErrorCategory.InvalidArgs)
    res.status(HttpStatus.BadRequest).send(genErrorRes(errorCode))
    return
  }

  const repo = new PostRepo()
  try {
    const post = await repo.find(parsedParams.id)
    if (!post) {
      const errCode = genErrCode(ApiCode.FindPost, ErrorCategory.NotFound)
      res.status(HttpStatus.NotFound).send(genErrorRes(errCode))
      return
    }
    res.status(200).send({ post: post })
  } catch (e) {
    systemLogger.error(e)
    const errorCode = genErrCode(ApiCode.FindPost, ErrorCategory.Unexpected)
    res.status(HttpStatus.InternalErr).send(genErrorRes(errorCode))
  }
}
