import { Router } from 'express'

import publiRouter from './publicationRoute.js'

const router = Router()

router.use(publiRouter)

export default router
