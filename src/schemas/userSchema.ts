import joi from 'joi'

const registerSchema = joi.object({
    email: joi.string().email().required(),
    nick: joi.string().required(),
    password: joi.string().required(),
})

const loginSchema = joi.object({
    email: joi.string().email(),
    nick: joi.string(),
    password: joi.string().required(),
})

export { registerSchema, loginSchema }
