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

    const isDeleted = await isTimeToDelete(publicationId, userId)
    if (isDeleted) {
        return
    }

    if (like === undefined) {
        like = null
    }

    await publicationRepo.changeLike(userId, publicationId, like)
}

async function getPublicationsByCategory(category: string) {
    return await publicationRepo.findPublicationsByCategory(category)
}

export default {
    getPublications,
    postPublication,
    getLike,
    postLike,
    getPublicationsByCategory,
}

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

async function isTimeToDelete(publicationId: number, userId: number) {
    const { likes: publicationsLikes } = await publicationRepo.getHowManyLikes(
        publicationId
    )
    if (publicationsLikes < -50) {
        await publicationRepo.deleteUserLikes(userId, publicationId)
        await publicationRepo.deleteCategoryPublication(publicationId)
        await publicationRepo.deletePublication(publicationId)
        return true
    }
    return false
}
