const Cryptr = require('cryptr')
require('dotenv').config()

const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const cryptr = new Cryptr(process.env.CRYPTER_KEY)

async function login(name, password) {
  logger.debug(`auth.service - login with name: ${name}`)

  const user = await userService.getByUser(name)
  if (!user) return Promise.reject('Invalid name or password')
  // TODO: un-comment for real login
  const match = await bcrypt.compare(password, user.password)
  if (!match) return Promise.reject('Invalid name or password')

  delete user.password
  return user
}

async function signup({ name, password, imgUrl }) {
  const saltRounds = 10

  logger.debug(
    `auth.service - signup with name: ${name}`
  )
  if (!name || !password)
    return Promise.reject('Name,  password and  imgUrl are required!')

  const hash = await bcrypt.hash(password, saltRounds)
  return userService.add({ name, password: hash, imgUrl })
}

function getLoginToken(user) {
  return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
  try {
    const json = cryptr.decrypt(loginToken)
    const loggedinuser = JSON.parse(json)
    return loggedinuser
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
