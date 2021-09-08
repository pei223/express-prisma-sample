import * as Express from 'express'
import AuthRouter from './Auth'
import PostRouter from './Post'

const router = Express.Router()

router.use('/auth', AuthRouter)
router.use('/', PostRouter)

export default router
