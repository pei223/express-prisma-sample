import { ApiCode } from './ApiConsts'

export type ErrorResponse = {
  error: {
    code: string
    data: any | null
  }
}

export enum ErrorCategory {
  Duplicate = 'DP',
  NotFound = 'NF',
  InvalidArgs = 'IA',
  AuthErr = 'AU',
  NoAuthority = 'NA',
  Unexpected = 'UN',
  AuthTimeOut = 'AT',
  NoAuthHeader = 'NA',
  AuthNg = 'NG',
}

export const genErrorRes = (
  errorCode: string,
  data: any = null
): ErrorResponse => {
  return {
    error: {
      code: errorCode,
      data,
    },
  }
}

export const genErrCode = (
  apiCode: ApiCode,
  errCategory: ErrorCategory,
  errNum = 0
) => {
  const apiCodeStr = `0000${apiCode}`.slice(-4)
  const errNumStr = `00000${errNum}`.slice(-5)
  return `${apiCodeStr}-${errCategory}-${errNumStr}`
}
