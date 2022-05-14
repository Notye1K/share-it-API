import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import userRepository, { UserBody } from '../repositories/userRepository.js'

async function findUser(nick: string) {
    return await userRepository.findUserbyNick(nick)
}

async function createUser(body: UserBody) {
    await testConflicts(body)
    changePassword(body)
    await userRepository.createUser(body)
}

async function login(body: Partial<UserBody>) {
    const nick = body.nick
    const email = body.email
    validateBody(nick, email)
    const user = await getUser(nick, email)
    comparePassword(user.password, body.password)
    const token = createToken(user)
    return token
}

export default { findUser, createUser, login }

function createToken(user: User) {
    delete user.password
    const secretKey = process.env.JWT_SECRET
    const token = jwt.sign(user, secretKey)
    return token
}

function validateBody(nick: string, email: string) {
    if (!nick && !email) {
        throw {
            type: 'user',
            status: 409,
            message: 'missing a email or a nick',
        }
    }
}

async function getUser(nick: string, email: string) {
    if (nick) {
        return await userRepository.findUserbyNick(nick)
    } else {
        return await userRepository.findUserByEmail(email)
    }
}

function comparePassword(userPassword: string, bodyPassword: string) {
    const result = bcrypt.compareSync(bodyPassword, userPassword)
    if (!result) {
        throw {
            type: 'user',
            status: 401,
            message: 'wrong password',
        }
    }
}

function changePassword(body: UserBody) {
    body.password = bcrypt.hashSync(body.password, 8)
}

async function testConflicts(body: UserBody) {
    const email = await userRepository.findUserByEmail(body.email)
    if (email) {
        throw { type: 'user', status: 409, message: 'email already exists' }
    }
    const nick = await userRepository.findUserbyNick(body.nick)
    if (nick) {
        throw { type: 'user', status: 409, message: 'nick already exists' }
    }
}
