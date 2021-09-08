import { Request, Response } from 'express'
import { systemLogger, accessLogger } from '../../infrastructure/logger/Log'
import PostRepo from '../../infrastructure/repository/PostRepository'
import { ApiCode, HttpStatus } from '../common/ApiConsts'
import {
  ErrorCategory,
  ErrorResponse,
  genErrCode,
  genErrorRes,
} from '../common/Error'
import {
  PostsQuery,
  PostsQueryValidation,
  PostsResult,
} from '../interfaces/posts/Posts'

export const Posts = async (
  req: Request<any, any, any, PostsQuery>,
  res: Response<PostsResult | ErrorResponse>
) => {
  accessLogger.info(`Access Posts page: ${req.query.page}`)

  let queries
  try {
    queries = PostsQueryValidation.parse(req.query)
  } catch (e) {
    const errorCode = genErrCode(ApiCode.Posts, ErrorCategory.InvalidArgs)
    res.status(HttpStatus.BadRequest).send(genErrorRes(errorCode, e))
    return
  }

  const postRepo = new PostRepo()
  try {
    const posts = await postRepo.getPosts(queries.page)
    res.status(200).send({ posts: posts })
  } catch (e) {
    systemLogger.error(e)
    const errorCode = genErrCode(ApiCode.Posts, ErrorCategory.Unexpected)
    res.status(HttpStatus.InternalErr).send(genErrorRes(errorCode))
  }
}
