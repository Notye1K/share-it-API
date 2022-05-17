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
