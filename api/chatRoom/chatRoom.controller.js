const chatRoomService = require('./chatRoom.service')
const logger = require('../../services/logger.service')

async function getChatRoom(req, res) {
  try {
    const chatRoom = await chatRoomService.getById(req.params.id)
    res.send(chatRoom)
  } catch (err) {
    logger.error('Failed to get chatRoom', err)
    res.status(500).send({ err: 'Failed to get chat room' })
  }
}
async function addChatRoom(req, res) {
  try {
    const chatRoom = await chatRoomService.add(req.body)
    logger.debug(`new chatRoom created: ` + JSON.stringify(chatRoom))
    res.json(chatRoom)
  } catch (error) {
    logger.error('faild to add chatRoom', error)
    res.status(401).send({ err: 'faild to add chatRoom' })
  }
}





// async function updateUser(req, res) {
//   try {
//     const user = req.body
//     const savedUser = await userService.update(user)
//     res.send(savedUser)
//   } catch (err) {
//     logger.error('Failed to update user', err)
//     res.status(500).send({ err: 'Failed to update user' })
//   }
// }

module.exports = {
  getChatRoom,
  addChatRoom
  // updateUser,
}
