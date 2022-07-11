
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    getById,
    // update,
    add
}


async function getById(chatRoomId) {
    try {
        const collection = await dbService.getCollection('chatRoom')
        const chatRoom = await collection.findOne({ _id: ObjectId(chatRoomId) })
        return chatRoom
    } catch (err) {
        logger.error(`while finding chatRoom ${chatRoomId}`, err)
        throw err
    }
}


// async function update(user) {
//     try {
//         // peek only updatable properties
//         const userToSave = {
//             _id: ObjectId(user._id), // needed for the returnd obj
//             name: user.name,           
//         }
//         console.log('userToSave', userToSave);
//         const collection = await dbService.getCollection('user')
//         await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
//         return userToSave
//     } catch (err) {
//         logger.error(`cannot update user ${user._id}`, err)
//         throw err
//     }
// }

async function add(chatRoom) {
    try {
        const chatRoomToAdd = {
            usersIds: chatRoom.usersIds,
            messages: chatRoom.messages,
        }
        const collection = await dbService.getCollection('chatRoom')
        await collection.insertOne(chatRoomToAdd)
        return chatRoomToAdd
    } catch (err) {
        logger.error('cannot insert charRoom', chatRoom)
        throw err
    }
}






