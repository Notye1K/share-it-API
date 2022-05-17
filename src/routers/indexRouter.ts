import { Router } from 'express'

import publiRouter from './publicationRouter.js'
import userRouter from './userRouter.js'
import categoryRouter from './categoryRouter.js'

const router = Router()

router.use(publiRouter)
router.use(userRouter)
router.use(categoryRouter)

export default router
