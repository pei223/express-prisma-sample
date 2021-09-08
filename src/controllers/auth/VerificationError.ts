import { ErrorCategory } from '../common/Error'

export default class VerificationError extends Error {
  readonly errorCategory: ErrorCategory

  constructor(verifyCode: ErrorCategory) {
    super('')
    // この2行がないと親クラスがthrowされる
    this.name = new.target.name
    Object.setPrototypeOf(this, new.target.prototype)
    this.errorCategory = verifyCode
  }
}
