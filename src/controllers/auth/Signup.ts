import { Request, Response } from 'express'
import { UserData } from '../../domain/models/UserData'
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
  SignUpBody,
  SignupRes,
  SignUpValidation,
} from '../interfaces/auth/Signup'

const EMAIL_DUPLICATE_CODE = 1
const USER_DUPLICATE_CODE = 2

export const Signup = async (
  req: Request<any, any, SignUpBody>,
  res: Response<SignupRes | ErrorResponse>
) => {
  try {
    SignUpValidation.parse(req.body)
  } catch (e) {
    const errorCode = genErrCode(ApiCode.Signup, ErrorCategory.InvalidArgs)
    res.status(HttpStatus.BadRequest).send(genErrorRes(errorCode, e))
    return
  }

  const repo = new UserRepo()

  if (!(await repo.isEmailUnique(req.body.email))) {
    const errorCode = genErrCode(
      ApiCode.Signup,
      ErrorCategory.Duplicate,
      EMAIL_DUPLICATE_CODE
    )
    res.status(HttpStatus.Conflict).send(genErrorRes(errorCode))
    return
  }

  if (!(await repo.isUserNameUnique(req.body.username))) {
    const errorCode = genErrCode(
      ApiCode.Signup,
      ErrorCategory.Duplicate,
      USER_DUPLICATE_CODE
    )
    res.status(HttpStatus.Conflict).send(genErrorRes(errorCode))
    return
  }

  try {
    const user = await repo.add(req.body)
    res.status(200).send({ user: user })
  } catch (e) {
    systemLogger.error(e)
    res.status(500).send(e)
  }
}
