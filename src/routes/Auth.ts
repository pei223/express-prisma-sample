import { Router } from 'express'
import { Login } from '../controllers/auth/Login'
import { Signup } from '../controllers/auth/Signup'

const AuthRouter = Router()

AuthRouter.post('/login', Login)
AuthRouter.post('/signup', Signup)

export default AuthRouter
