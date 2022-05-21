import joi from 'joi'

const publicationSchema = joi.object({
    title: joi.string().required().max(30),
    text: joi.string().max(300).allow(''),
    link: joi.string().uri().allow(''),
    categoryIds: joi.array().items(joi.number()).max(3).required(),
})

const likePublicationSchema = joi.object({
    like: joi.boolean().allow(null),
})

export { publicationSchema, likePublicationSchema }
