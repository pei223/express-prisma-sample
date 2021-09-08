//server.js
import app from './app'
import { initLogger, systemLogger } from './infrastructure/logger/Log'

app.listen(3000, () => {
  initLogger()
  systemLogger.info('Listen 3000')
})
