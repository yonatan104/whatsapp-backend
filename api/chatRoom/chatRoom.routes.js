const express = require('express')
const { getChatRoom, addChatRoom } = require('./chatRoom.controller')
// const { getChatRoom, updateUser } = require('./chatRoom.controller')
const router = express.Router()

router.get('/:id', getChatRoom)
router.post('/:id', addChatRoom)
// router.put('/:id', updateUser)


module.exports = router