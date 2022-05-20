import { Router } from 'express'

import * as publicationController from '../controllers/publicationController.js'
import validateTokenMiddleware from '../middlewares/validateTokenMiddleware.js'
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js'
import publicationSchema from '../schemas/publicationSchema.js'

const publiRouter = Router()

publiRouter.get('/publications', publicationController.getPublications)
publiRouter.post(
    '/publications',
    validateTokenMiddleware,
    validateSchemaMiddleware(publicationSchema),
    publicationController.postPublication
)

export default publiRouter
