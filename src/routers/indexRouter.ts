import { Router } from 'express'

import publiRouter from './publicationRoute.js'
import userRouter from './userRouter.js'

const router = Router()

router.use(publiRouter)
router.use(userRouter)

export default router
