module.exports = (http) => {
    const socket_server = require('socket.io')(http);
    let socket_connections = {}
    socket_server.on('connection', (socket_conenction) => {
        console.log('got connection')
        socket_conenction.on('disconnect', () => {
            console.log('someone has disconnected')
        })

        socket_conenction.on('/hello', (uuid) => {
            socket_connections[uuid] = socket_conenction
        })

        socket_conenction.on('test', (somewhat) => {
            console.log(somewhat)
        })
    })
    // return socket_connections
}