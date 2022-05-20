import prismaClient from '../database.js'

async function getPublications() {
    return await prismaClient.publication.findMany({
        include: { categoriesPublications: { include: { category: true } } },
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

export default { getPublications, insertPublication, insertCategoryPublication }
