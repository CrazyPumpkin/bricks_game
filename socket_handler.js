module.exports = (http) => {
    const socket_server = require('socket.io')(http);
    let socket_connections = {}
    socket_server.on('connection', (socket_conenction) => {
        console.log('got connection')
        socket_conenction.qurey = []
        socket_conenction.on('disconnect', () => {
            console.log(`${socket_conenction.uuid} has disconnected`)
            delete socket_connections[socket_conenction.uuid]
        })


        socket_conenction.on('/hello', (uuid) => {
            socket_conenction.uuid = uuid
            socket_connections[uuid] = socket_conenction
            console.log(`${uuid} has been initialized`)
        })

        socket_conenction.on('/event', (action) => {
            socket_conenction.qurey.push(action)
        })
    })
    return socket_connections
}
