const Cryptr = require('cryptr')
require('dotenv').config()

const bcrypt = require('bcrypt')
const contactService = require('../contact/contact.service')
const logger = require('../../services/logger.service')

const cryptr = new Cryptr(process.env.CRYPTER_KEY)

async function login(name, password) {
  logger.debug(`auth.service - login with name: ${name}`)

  const contact = await contactService.getByContact(name)
  if (!contact) return Promise.reject('Invalid name or password')
  // TODO: un-comment for real login
  const match = await bcrypt.compare(password, contact.password)
  if (!match) return Promise.reject('Invalid name or password')

  delete contact.password
  return contact
}

async function signup({ name, password, imgUrl }) {
  const saltRounds = 10

  logger.debug(
    `auth.service - signup with name: ${name}`
  )
  if (!name || !password)
    return Promise.reject('Name,  password and  imgUrl are required!')

  const hash = await bcrypt.hash(password, saltRounds)
  return contactService.add({ name, password: hash, imgUrl })
}

function getLoginToken(contact) {
  return cryptr.encrypt(JSON.stringify(contact))
}

function validateToken(loginToken) {
  try {
    const json = cryptr.decrypt(loginToken)
    const loggedincontact = JSON.parse(json)
    return loggedincontact
  } catch (err) {
    console.log('Invalid login token')
  }
  return null
}

module.exports = {
  signup,
  login,
  getLoginToken,
  validateToken,
}
