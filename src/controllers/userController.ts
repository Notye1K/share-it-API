import { Request, Response } from 'express'

import userService from '../services/userService.js'

export async function register(req: Request, res: Response) {
    await userService.createUser(req.body)
    res.sendStatus(201)
}

export async function login(req: Request, res: Response) {
    const result = await userService.login(req.body)
    res.send(result)
}

export async function checkToken(req: Request, res: Response) {
    res.sendStatus(200)
}
