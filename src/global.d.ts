/* eslint-disable @typescript-eslint/naming-convention */
/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly DATABASE_URL: string
    readonly PASSWORD_HASH_STRETCH: string
    readonly PASSWORD_SALT: string
    readonly JWT_SECRET_KEY: string
    readonly JWT_ALGORITHM: string
    readonly JWT_EXPIRES_IN: string
    readonly REMOVE_CORS: string
    readonly ENV: 'prod' | 'test' | 'dev'
  }
}
