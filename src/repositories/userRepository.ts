import { User } from '@prisma/client'
import prismaClient from '../database.js'

export type UserBody = Omit<User, 'id'>

async function findUserbyNick(nick: string) {
    return await prismaClient.user.findUnique({
        where: { nick },
    })
}

async function createUser(body: UserBody) {
    await prismaClient.user.create({
        data: { ...body },
    })
}

async function findUserByEmail(email: string) {
    return await prismaClient.user.findUnique({
        where: {
            email,
        },
    })
}

export default { findUserbyNick, createUser, findUserByEmail }
