import { Request, Response } from 'express'
import { systemLogger } from '../../infrastructure/logger/Log'
import { ApiCode, HttpStatus } from '../common/ApiConsts'
import { ErrorCategory, genErrCode, genErrorRes } from '../common/Error'
import { JsonWebToken, UserPayloadData } from './JsonWebToken'
import VerificationError from './VerificationError'

type Controller = (req: Request, res: Response) => void

type LoginedController = (
  req: Request<any, any, any>,
  res: Response<any>,
  payload: UserPayloadData
) => void

export const RequireAuth = (controller: LoginedController): Controller => {
  return (req: Request, res: Response) => {
    let payload
    try {
      payload = new JsonWebToken().checkToken(req)
    } catch (e) {
      if (e instanceof VerificationError) {
        const errorCode = genErrCode(ApiCode.CommonAuth, e.errorCategory)
        res.status(HttpStatus.Unauthorized).send(genErrorRes(errorCode))
        return
      }
      systemLogger.error(e)
      const errorCode = genErrCode(ApiCode.CommonAuth, ErrorCategory.Unexpected)
      res.status(500).send(genErrorRes(errorCode))
      return
    }
    return controller(req, res, payload)
  }
}
