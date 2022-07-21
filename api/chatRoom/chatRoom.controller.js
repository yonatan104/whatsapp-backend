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





async function updateChatRoom(req, res) {
  try {
    const chatRoom = req.body
    const savedChatRoom = await chatRoomService.update(chatRoom)
    res.send(savedChatRoom)
    
  } catch (err) {
    logger.error('Failed to update chat room', err)
    res.status(500).send({ err: 'Failed to update chat room' })
  }
}

module.exports = {
  getChatRoom,
  addChatRoom,
  updateChatRoom
}
