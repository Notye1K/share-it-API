import joi from 'joi'

const publicationSchema = joi.object({
    title: joi.string().required(),
    text: joi.string(),
    link: joi.string().uri(),
})

export default publicationSchema
