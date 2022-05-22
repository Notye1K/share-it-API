import { Router } from 'express'

import * as publicationController from '../controllers/publicationController.js'
import validateTokenMiddleware from '../middlewares/validateTokenMiddleware.js'
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js'
import {
    publicationSchema,
    likePublicationSchema,
} from '../schemas/publicationSchema.js'

const publiRouter = Router()

publiRouter.get('/publications', publicationController.getPublications)
publiRouter.post(
    '/publications',
    validateTokenMiddleware,
    validateSchemaMiddleware(publicationSchema),
    publicationController.postPublication
)
publiRouter.get(
    '/publications/:publicationId/like',
    validateTokenMiddleware,
    publicationController.getLike
)
publiRouter.post(
    '/publications/:publicationId/like',
    validateTokenMiddleware,
    validateSchemaMiddleware(likePublicationSchema),
    publicationController.postLike
)

publiRouter.get(
    '/publications/categories/:category',
    publicationController.getPublicationsByCategory
)

export default publiRouter
