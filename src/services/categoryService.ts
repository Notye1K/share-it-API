import categoryRepository from '../repositories/categoryRepository.js'

async function postCategory(title: string) {
    title = title.toLowerCase()
    await validateTitle(title)

    await categoryRepository.create(title)
}

async function getCategories() {
    return categoryRepository.findMany()
}

export default { postCategory, getCategories }

async function validateTitle(title: string) {
    const result = await categoryRepository.findUnique({ title })

    if (result) {
        throw {
            type: 'user',
            status: 409,
            message: 'category already exists',
        }
    }
}
