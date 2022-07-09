const express = require('express')
const { getContact, getContacts, updateContact } = require('./contact.controller')
const router = express.Router()

router.get('/', getContacts)
router.get('/:id', getContact)
router.put('/:id', updateContact)


module.exports = router