import { Request } from 'express'
import { UserData } from '../../domain/models/UserData'
import { ErrorCategory } from '../common/Error'
import VerificationError from './VerificationError'

export interface UserPayloadData {
  username: string
}

export class JsonWebToken {
  private readonly jwt = require('jsonwebtoken')
  private readonly secretKey: string | undefined = process.env.JWT_SECRET_KEY
  private readonly algorithm: string | undefined = process.env.JWT_ALGORITHM
  private readonly expiresIn: string | undefined = process.env.JWT_EXPIRES_IN

  generateToken(user: UserData): string {
    const options = {
      algorithm: this.algorithm,
      expiresIn: this.expiresIn,
    }
    const payload: UserPayloadData = {
      username: user.username,
    }
    return this.jwt.sign(payload, this.secretKey, options)
  }

  checkToken(req: Request): UserPayloadData {
    if (
      !req.headers.authorization ||
      req.headers.authorization.split(' ')[0] !== 'Bearer'
    ) {
      throw new VerificationError(ErrorCategory.NoAuthHeader)
    }

    const token = req.headers.authorization.split(' ')[1]

    try {
      const decodedData: UserPayloadData = this.jwt.verify(
        token,
        this.secretKey
      )
      return decodedData
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new VerificationError(ErrorCategory.AuthTimeOut)
      }
      throw new VerificationError(ErrorCategory.AuthNg)
    }
  }
}
