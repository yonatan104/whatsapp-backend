const logger = require('./logger.service')
const activityService = require('../api/activity/activity.service')
var gIo = null

function setupSocketAPI(http) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        logger.info(`New connected socket [id: ${socket.id}]`)
        socket.on('disconnect', socket => {
            logger.info(`Socket disconnected [id: ${socket.id}]`)
        })
        socket.on('enter-station', stationId => {
            if (socket.stationId === stationId) return
            if (socket.stationId) {
                socket.leave(socket.stationId)
                logger.info(`Socket is leaving topic ${socket.stationId} [id: ${socket.stationId}]`)
            }
            socket.stationId = stationId
            socket.join(stationId)
            console.log('contact entered station!', stationId)
        })
        socket.on('update-station', station => {
            socket.broadcast.to(station._id).emit('station-updated', station)
        })
        socket.on('activity-log-made', activity => {
            activityService.add(activity)
            gIo.emit('activity-log-made', activity)
            // socket.broadcast.emit('activity-log-made-brodcast', data)
        })
        socket.on('set-contact-socket', contactId => {
            logger.info(`Setting socket.contactId = ${contactId} for socket [id: ${socket.id}]`)
            socket.contactId = contactId
        })
        socket.on('unset-contact-socket', () => {
            logger.info(`Removing socket.contactId for socket [id: ${socket.id}]`)
            delete socket.contactId
        })

    })
}

function emitTo({ type, data, label }) {
    if (label) gIo.to('watching:' + label).emit(type, data)
    else gIo.emit(type, data)
}

async function emitToUser({ type, data, contactId }) {
    const socket = await _getUserSocket(contactId)

    if (socket) {
        logger.info(`Emiting event: ${type} to contact: ${contactId} socket [id: ${socket.id}]`)
        socket.emit(type, data)
    } else {
        logger.info(`No active socket for contact: ${contactId}`)
        // _printSockets()
    }
}

// If possible, send to all sockets BUT not the current socket 
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null, contactId }) {
    logger.info(`Broadcasting event: ${type}`)
    const excludedSocket = await _getUserSocket(contactId)
    if (room && excludedSocket) {
        logger.info(`Broadcast to room ${room} excluding contact: ${contactId}`)
        excludedSocket.broadcast.to(room).emit(type, data)
    } else if (excludedSocket) {
        logger.info(`Broadcast to all excluding contact: ${contactId}`)
        excludedSocket.broadcast.emit(type, data)
    } else if (room) {
        logger.info(`Emit to room: ${room}`)
        gIo.to(room).emit(type, data)
    } else {
        logger.info(`Emit to all`)
        gIo.emit(type, data)
    }
}

async function _getUserSocket(contactId) {
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => s.contactId === contactId)
    return socket
}
async function _getAllSockets() {
    // return all Socket instances
    const sockets = await gIo.fetchSockets()
    return sockets
}

module.exports = {
    // set up the sockets service and define the API
    setupSocketAPI,
    // emit to everyone / everyone in a specific room (label)
    emitTo,
    // emit to a specific contact (if currently active in system)
    emitToUser,
    // Send to all sockets BUT not the current socket - if found
    // (otherwise broadcast to a room / to all)
    broadcast,
}