import joi from 'joi'

const categorySchema = joi.object({
    title: joi.string().required(),
})

export default categorySchema
