const authService = require('./auth.service')
const logger = require('../../services/logger.service')

async function login(req, res) {
    const { name, password } = req.body
    try {
        const contact = await authService.login(name, password)
        const loginToken = authService.getLoginToken(contact)
        
        logger.info('contact login: ', contact)
        res.cookie('loginToken', loginToken)

        res.json(contact)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

async function signup(req, res) {
    try {
        const credentials = req.body
        console.log("🚀 ~ file: auth.controller.js ~ line 24 ~ signup ~ req.body", req.body)
        // Never log passwords
        const account = await authService.signup(credentials)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
        const contact = await authService.login(credentials.name, credentials.password)
        const loginToken = authService.getLoginToken(contact)
        logger.info('contact login: ', contact)
        res.cookie('loginToken', loginToken)
        res.json(contact)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

async function logout(req, res){
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

module.exports = {
    login,
    signup,
    logout
}