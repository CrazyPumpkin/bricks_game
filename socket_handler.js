module.exports = (http) => {
    const socket_server = require('socket.io')(http);
    console.log(123)
    socket_server.on('connection', (socket_conenction) => {
        console.log('got connection')
        socket_conenction.on('disconnect', () => {
            console.log('someone has disconnected')
        })

        socket_conenction.on('test', (somewhat) => {
            console.log(somewhat)
        })
    })

}