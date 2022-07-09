
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    getByContact,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('contact')
        var contacts = await collection.find(criteria).toArray()
        contacts = contacts.map(contact => {
            delete contact.password
            contact.createdAt = ObjectId(contact._id).getTimestamp()
            return contact
        })
        return contacts
    } catch (err) {
        logger.error('cannot find contacts', err)
        throw err
    }
}

async function getById(contactId) {
    try {
        const collection = await dbService.getCollection('contact')
        const contact = await collection.findOne({ _id: ObjectId(contactId) })
        delete contact.password


        return contact
    } catch (err) {
        logger.error(`while finding contact ${contactId}`, err)
        throw err
    }
}
async function getByContact(name) {
    try {
        const collection = await dbService.getCollection('contact')
        const contact = await collection.findOne({ name })
        return contact
    } catch (err) {
        logger.error(`while finding contact ${name}`, err)
        throw err
    }
}

async function remove(contactId) {
    try {
        const collection = await dbService.getCollection('contact')
        await collection.deleteOne({ '_id': ObjectId(contactId) })
    } catch (err) {
        logger.error(`cannot remove contact ${contactId}`, err)
        throw err
    }
}

async function update(contact) {
    try {
        // peek only updatable properties
        const contactToSave = {
            _id: ObjectId(contact._id), // needed for the returnd obj
            name: contact.name,           
        }
        console.log('contactToSave', contactToSave);
        const collection = await dbService.getCollection('contact')
        await collection.updateOne({ _id: contactToSave._id }, { $set: contactToSave })
        return contactToSave
    } catch (err) {
        logger.error(`cannot update contact ${contact._id}`, err)
        throw err
    }
}

async function add(contact) {
    try {
        const contactToAdd = {
            name: contact.name,
            password: contact.password,
            imgUrl: contact.imgUrl
        }
        const collection = await dbService.getCollection('contact')
        await collection.insertOne(contactToAdd)
        return contactToAdd
    } catch (err) {
        logger.error('cannot insert contact', contact)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    // if (filterBy.txt) {
    //     const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
    //     criteria.$or = [
    //         {
    //             name: txtCriteria
    //         },
    //         {
    //             fullname: txtCriteria
    //         }
    //     ]
    // }

    return criteria
}




