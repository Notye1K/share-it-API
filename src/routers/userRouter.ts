import { Router } from 'express'

import * as userController from '../controllers/userController.js'
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js'
import { loginSchema, registerSchema } from '../schemas/userSchema.js'

const userRouter = Router()

userRouter.post(
    '/register',
    validateSchemaMiddleware(registerSchema),
    userController.register
)
userRouter.post(
    '/login',
    validateSchemaMiddleware(loginSchema),
    userController.login
)

export default userRouter
