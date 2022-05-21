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

async function getLike(userId: number, publicationId: number) {
    validateId(publicationId)
    const result = await publicationRepo.getLike(userId, publicationId)

    return result?.like
}

async function postLike(
    userId: number,
    publicationId: number,
    like: boolean | undefined
) {
    validateId(publicationId)

    const result = await publicationRepo.getLike(userId, publicationId)
    const resultLike = result?.like

    await updatePublication(resultLike, like, publicationId)

    if (like === undefined) {
        like = null
    }

    await publicationRepo.changeLike(userId, publicationId, like)

    //TODO if 50
}

export default { getPublications, postPublication, getLike, postLike }

async function validateBody(body: PublicationBody) {
    if (!body.text && !body.link) {
        throw { type: 'user', status: 422, message: 'missing a text or a link' }
    }

    await validateCategoryId(body)
}

async function updatePublication(
    resultLike: boolean,
    like: boolean,
    publicationId: number
) {
    if (resultLike === like) {
        return
    } else if (resultLike && like === undefined) {
        await publicationRepo.updateLike(publicationId, -1)
    } else if (resultLike && like === false) {
        await publicationRepo.updateLike(publicationId, -2)
    } else if ((resultLike === undefined || resultLike === null) && like) {
        await publicationRepo.updateLike(publicationId, 1)
    } else if (
        (resultLike === undefined || resultLike === null) &&
        like === false
    ) {
        await publicationRepo.updateLike(publicationId, -1)
    } else if (resultLike === false && like) {
        await publicationRepo.updateLike(publicationId, 2)
    } else if (resultLike === false && like === undefined) {
        await publicationRepo.updateLike(publicationId, 1)
    }
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

function validateId(id: number) {
    if (isNaN(id)) {
        throw { type: 'user', status: 400, message: 'invalid publicationId' }
    }
}
