import prismaClient from '../database.js'

async function create(title: string) {
    await prismaClient.category.create({
        data: { title },
    })
}

async function findUnique({
    title,
    categoryId,
}: {
    title?: string
    categoryId?: number
}) {
    if (title) {
        return await prismaClient.category.findUnique({
            where: { title },
        })
    } else {
        return await prismaClient.category.findUnique({
            where: { id: categoryId },
        })
    }
}

async function findMany() {
    return await prismaClient.category.findMany()
}

export default { create, findMany, findUnique }
