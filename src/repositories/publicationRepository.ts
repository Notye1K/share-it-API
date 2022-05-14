import prismaClient from '../database'

async function getPublications() {
    return await prismaClient.publication.findMany()
}

export interface PublicationBody {
    title: string
    link: string | null
    text: string | null
    userId: number
}

async function insertPublication(body: PublicationBody) {
    await prismaClient.publication.create({
        data: { ...body },
    })
}

export default { getPublications, insertPublication }
