import * as log4js from 'log4js'
import loggingLocal from './config/logging_local.json'
import loggingProd from './config/logging_prod.json'

export const accessLogger = log4js.getLogger('access')
export const systemLogger = log4js.getLogger('system')
export const errorLogger = log4js.getLogger('error')

export const initLogger = () => {
  switch (process.env.ENV) {
    case 'dev':
    case 'test':
      log4js.configure(loggingLocal)
      break
    case 'prod':
      log4js.configure(loggingProd)
      break
    default:
      log4js.configure(loggingLocal)
      break
  }
}
