import { Router } from 'express'

import * as categoryController from '../controllers/categoryController.js'
import validateTokenMiddleware from '../middlewares/validateTokenMiddleware.js'
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js'
import categorySchema from '../schemas/categorySchema.js'

const categoryRouter = Router()

categoryRouter.get('/categories', categoryController.getCategories)
categoryRouter.post(
    '/categories',
    validateTokenMiddleware,
    validateSchemaMiddleware(categorySchema),
    categoryController.postCategory
)

export default categoryRouter
