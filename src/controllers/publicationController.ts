import { Request, Response } from 'express'

import publicationService from '../services/publicationService.js'

export async function getPublications(req: Request, res: Response) {
    const publications = await publicationService.getPublications()
    res.send(publications)
}

export async function postPublication(req: Request, res: Response) {
    const userId = res.locals.user

    await publicationService.postPublication({ ...req.body, userId: userId.id })
    res.sendStatus(201)
}

export async function getLike(req: Request, res: Response) {
    const { id } = res.locals.user
    const { publicationId } = req.params

    const result = await publicationService.getLike(+id, +publicationId)

    res.send(result)
}

export async function postLike(req: Request, res: Response) {
    const { id } = res.locals.user
    const { like } = req.body
    const { publicationId } = req.params

    await publicationService.postLike(+id, +publicationId, like)

    res.sendStatus(200)
}

export async function getPublicationsByCategory(req: Request, res: Response) {
    const { category } = req.params
    const result = await publicationService.getPublicationsByCategory(category)

    res.send(result)
}
