import { Request, Response } from 'express'

import categoryService from '../services/categoryService.js'

export async function postCategory(req: Request, res: Response) {
    const title = req.body.title

    await categoryService.postCategory(title)

    res.sendStatus(201)
}

export async function getCategories(req: Request, res: Response) {
    const result = await categoryService.getCategories()

    res.send(result)
}
