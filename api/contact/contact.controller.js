const contactService = require('./contact.service')
const logger = require('../../services/logger.service')

async function getContact(req, res) {
  try {
    const contact = await contactService.getById(req.params.id)
    res.send(contact)
  } catch (err) {
    logger.error('Failed to get contact', err)
    res.status(500).send({ err: 'Failed to get contact' })
  }
}

async function getContacts(req, res) {
  try {
    const filterBy = {
      txt: req.query?.txt || '',
      minBalance: +req.query?.minBalance || 0,
    }
    const contacts = await contactService.query(filterBy)
    res.send(contacts)
  } catch (err) {
    logger.error('Failed to get contacts', err)
    res.status(500).send({ err: 'Failed to get contacts' })
  }
}

async function deleteContact(req, res) {
  try {
    await contactService.remove(req.params.id)
    res.send({ msg: 'Deleted successfully' })
  } catch (err) {
    logger.error('Failed to delete contact', err)
    res.status(500).send({ err: 'Failed to delete contact' })
  }
}

async function updateContact(req, res) {
  try {
    const contact = req.body
    const savedContact = await contactService.update(contact)
    res.send(savedContact)
  } catch (err) {
    logger.error('Failed to update contact', err)
    res.status(500).send({ err: 'Failed to update contact' })
  }
}

module.exports = {
  getContact,
  getContacts,
  deleteContact,
  updateContact,
}
