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

async function findPublicationsByCategory(category: string) {
    return prismaClient.category.findFirst({
        where: { title: category },
        include: {
            categoriesPublications: {
                include: {
                    publication: {
                        include: {
                            categoriesPublications: {
                                include: { category: true },
                            },
                        },
                    },
                },
            },
        },
    })
}

async function findPublication(publicationId: number) {
    return prismaClient.publication.findUnique({
        where: { id: publicationId },
    })
}

async function deletePublication(publicationId: number) {
    await prismaClient.publication.delete({
        where: { id: publicationId },
    })
}

async function deleteUserLikes(publicationId: number) {
    await prismaClient.userLikes.deleteMany({
        where: { publicationId },
    })
}

async function deleteCategoryPublication(publicationId: number) {
    await prismaClient.categoryPublication.deleteMany({
        where: { publicationId },
    })
}

export default {
    getPublications,
    insertPublication,
    insertCategoryPublication,
    getLike,
    changeLike,
    updateLike,
    findPublicationsByCategory,
    findPublication,
    deletePublication,
    deleteUserLikes,
    deleteCategoryPublication,
}
