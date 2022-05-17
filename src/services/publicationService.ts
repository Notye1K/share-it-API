import publicationRepo, {
    PublicationBody,
} from '../repositories/publicationRepository.js'
import categoryRepository from '../repositories/categoryRepository.js'

async function getPublications() {
    return await publicationRepo.getPublications()
}

async function postPublication(body: PublicationBody) {
    await validateBody(body)

    const { categoryIds, ...rest } = body
    const { id } = await publicationRepo.insertPublication(rest)

    categoryIds.forEach(async (categoryId) => {
        await publicationRepo.insertCategoryPublication(id, categoryId)
    })
}

export default { getPublications, postPublication }

async function validateBody(body: PublicationBody) {
    if (!body.text && !body.link) {
        throw { type: 'user', status: 422, message: 'missing a text or a link' }
    }

    await validateCategoryId(body)
}

async function validateCategoryId(body: PublicationBody) {
    const categoryIds = body.categoryIds
    categoryIds.forEach(async (categoryId) => {
        const category = await categoryRepository.findUnique({ categoryId })
        if (!category) {
            throw { type: 'user', status: 404, message: 'invalid categoryId' }
        }
    })
}
