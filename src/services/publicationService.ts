import publicationRepo, {
    PublicationBody,
} from '../repositories/publicationRepository.js'

async function getPublications() {
    return await publicationRepo.getPublications()
}

async function postPublication(body: PublicationBody) {
    validateBody(body)

    await publicationRepo.insertPublication(body)
}

export default { getPublications, postPublication }

function validateBody(body: PublicationBody) {
    if (!body.text && !body.link) {
        throw { type: 'user', status: 422, message: 'missing a text or a link' }
    }
}
