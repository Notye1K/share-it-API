import prismaClient from '../database.js'

async function getPublications() {
    return await prismaClient.publication.findMany({
        include: { categoriesPublications: { include: { category: true } } },
        orderBy: { id: 'desc' },
    })
}

export interface PublicationBody {
    title: string
    link: string | null
    text: string | null
    userId: number
    categoryIds: number[]
}

async function insertPublication(body: Omit<PublicationBody, 'categoryIds'>) {
    return await prismaClient.publication.create({
        data: { ...body },
    })
}

async function insertCategoryPublication(
    publicationId: number,
    categoryId: number
) {
    await prismaClient.categoryPublication.create({
        data: { categoryId, publicationId },
    })
}

async function getLike(userId: number, publicationId: number) {
    return await prismaClient.userLikes.findUnique({
        where: { userId_publicationId: { userId, publicationId } },
    })
}

async function changeLike(
    userId: number,
    publicationId: number,
    like: boolean | null
) {
    await prismaClient.userLikes.upsert({
        where: { userId_publicationId: { userId, publicationId } },
        update: { like },
        create: {
            userId,
            publicationId,
            like,
        },
    })
}

async function updateLike(publicationId: number, number: number) {
    await prismaClient.publication.update({
        where: { id: publicationId },
        data: { likes: { increment: number } },
    })
}

export default {
    getPublications,
    insertPublication,
    insertCategoryPublication,
    getLike,
    changeLike,
    updateLike,
}
