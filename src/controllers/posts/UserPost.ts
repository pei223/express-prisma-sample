import { Request, Response } from 'express'
import { systemLogger, accessLogger } from '../../infrastructure/logger/Log'
import PostRepo from '../../infrastructure/repository/PostRepository'
import UserRepo from '../../infrastructure/repository/UserRepository'
import { ApiCode, HttpStatus } from '../common/ApiConsts'
import {
  ErrorCategory,
  ErrorResponse,
  genErrCode,
  genErrorRes,
} from '../common/Error'
import {
  UserPostParams,
  UserPostResult,
  UserPostParamsValidation,
} from '../interfaces/posts/UserPost'

export const UserPost = async (
  req: Request<UserPostParams>,
  res: Response<UserPostResult | ErrorResponse>
) => {
  accessLogger.info(`Access UserPost : ${req.params.username}`)

  try {
    UserPostParamsValidation.parse(req.params)
  } catch (e) {
    const errorCode = genErrCode(ApiCode.UserPost, ErrorCategory.InvalidArgs)
    res.status(HttpStatus.BadRequest).send(genErrorRes(errorCode, e))
    return
  }

  const postRepo = new PostRepo()
  try {
    const user = await new UserRepo().getUser(req.params.username)
    if (!user) {
      systemLogger.warn(`${req.params.username} is not exist.`)
      const errorCode = genErrCode(ApiCode.UserPost, ErrorCategory.NotFound)
      res.status(HttpStatus.NotFound).send(genErrorRes(errorCode))
      return
    }
    const posts = await postRepo.userPosts(user.id)
    res.status(200).send({ posts: posts })
  } catch (e) {
    systemLogger.error(e)
    const errorCode = genErrCode(ApiCode.UserPost, ErrorCategory.Unexpected)
    res.status(HttpStatus.InternalErr).send(genErrorRes(errorCode))
  }
}
