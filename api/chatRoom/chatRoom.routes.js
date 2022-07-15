const express = require('express')
const { getChatRoom, addChatRoom, updateChatRoom } = require('./chatRoom.controller')
const router = express.Router()

router.get('/:id', getChatRoom)
router.post('/', addChatRoom)
router.put('/:id', updateChatRoom)


module.exports = router