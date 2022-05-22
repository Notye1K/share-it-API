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

    const isDeleted = await isTimeToDelete(publicationId)
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

async function userDeletePublication(userId: number, publicationId: number) {
    validateId(publicationId)

    await validatePermissionToDelete(publicationId, userId)

    await deletePublication(publicationId)
}

export default {
    getPublications,
    postPublication,
    getLike,
    postLike,
    getPublicationsByCategory,
    userDeletePublication,
}

async function validatePermissionToDelete(
    publicationId: number,
    userId: number
) {
    const publication = await publicationRepo.findPublication(publicationId)

    if (userId !== publication.userId) {
        throw { type: 'user', status: 401, message: 'Unauthorized' }
    }
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

async function isTimeToDelete(publicationId: number) {
    const { likes: publicationsLikes } = await publicationRepo.findPublication(
        publicationId
    )
    if (publicationsLikes < -50) {
        await deletePublication(publicationId)
        return true
    }
    return false
}

async function deletePublication(publicationId: number) {
    await publicationRepo.deleteUserLikes(publicationId)
    await publicationRepo.deleteCategoryPublication(publicationId)
    await publicationRepo.deletePublication(publicationId)
}
