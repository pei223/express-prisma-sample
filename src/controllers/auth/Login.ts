import { Request, Response } from 'express'
import { systemLogger } from '../../infrastructure/logger/Log'
import UserRepo from '../../infrastructure/repository/UserRepository'
import { ApiCode, HttpStatus } from '../common/ApiConsts'
import {
  ErrorCategory,
  ErrorResponse,
  genErrCode,
  genErrorRes,
} from '../common/Error'
import {
  LoginBody,
  LoginBodyValidation,
  LoginResult,
} from '../interfaces/auth/Login'
import { JsonWebToken } from './JsonWebToken'

export const Login = async (
  req: Request<any, any, LoginBody>,
  res: Response<LoginResult | ErrorResponse>
) => {
  try {
    LoginBodyValidation.parse(req.body)
  } catch (e) {
    const errorCode = genErrCode(ApiCode.Login, ErrorCategory.InvalidArgs)
    res.status(HttpStatus.BadRequest).send(genErrorRes(errorCode))
    return
  }

  try {
    const user = await new UserRepo().loginUser(
      req.body.username,
      req.body.password
    )
    if (!user) {
      const errorCode = genErrCode(ApiCode.Login, ErrorCategory.AuthErr)
      res.status(HttpStatus.BadRequest).send(genErrorRes(errorCode))
      return
    }
    const token = new JsonWebToken().generateToken(user)

    res.status(200).send({ user: user, token: token })
  } catch (e) {
    systemLogger.error(e)
    const errorCode = genErrCode(ApiCode.Login, ErrorCategory.Unexpected)
    res.status(500).send(genErrorRes(errorCode))
  }
}
