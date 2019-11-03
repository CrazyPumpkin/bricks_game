const cookie = require('cookie')

module.exports = (http) => {
    const socket_server = require('socket.io')(http);
    let socket_connections = {}
    socket_server.on('connection', (socket_conenction) => {
        socket_conenction.query = []
        socket_conenction.on('disconnect', () => {
            console.log(`${socket_conenction.user_id} has disconnected`)

            socket_conenction.query.push({
                action: "connection",
                enum: 'disconnected',
                user_id: socket_conenction.user_id
            })
        })


        socket_conenction.on('/hello', (user_id) => {
            cookies = cookie.parse(socket_conenction.request.headers.cookie)

            socket_conenction.user_id = cookies.user_id
            socket_connections[cookies.user_id] = socket_conenction
            console.log(`${cookies.user_id} has been initialized`)

            socket_conenction.query.push({
                action: "connection",
                enum: 'connected',
                user_id: cookies.user_id
            })

        })

        socket_conenction.on('/event', (action) => {
            socket_conenction.query.push(action)
        })

    })
    return socket_connections
}
