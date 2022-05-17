import joi from 'joi'

const publicationSchema = joi.object({
    title: joi.string().required(),
    text: joi.string(),
    link: joi.string().uri(),
    categoryIds: joi.array().items(joi.number()).max(3).required(),
})

export default publicationSchema
