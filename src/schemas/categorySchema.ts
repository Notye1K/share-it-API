import joi from 'joi'

const categorySchema = joi.object({
    title: joi.string().max(15).required(),
})

export default categorySchema
