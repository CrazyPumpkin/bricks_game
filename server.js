const express = require('express')
const app = express()
const http = require('http').createServer(app)

const socket_server = require('socket.io')(http);
console.log(123)

const config = require('./config')


app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile('index.html')
})

let socket_connections =  require('./socket_handler')(http)

state = {
    users: {
        "22ca3b2d-aba1-43fe-98c1-2e6c0bb9b0d4": {x: 10, y: 10},
        "c551d7a4-0fb3-4abb-8efd-6e71b48bd547": {x: 10, y: 10}
    }
}

setInterval(()=>{
    //gathering events
    delta = {
        "22ca3b2d-aba1-43fe-98c1-2e6c0bb9b0d4": {x: 0, y: 0},
        "c551d7a4-0fb3-4abb-8efd-6e71b48bd547": {x: 0, y: 0}
    }
    for (let uuid in socket_connections) {
        let current_connection = socket_connections[uuid]
        for (action of current_connection.qurey) {
            switch (action.enum) {
                case "ArrowRight":
                    delta[uuid].x += 10
                    break
                case "ArrowLeft":
                    delta[uuid].x -= 10
                    break
                case "ArrowUp":
                    delta[uuid].y += 10
                    break
                case "ArrowDown":
                    delta[uuid].y -= 10
                    break
            }
        }
        current_connection.qurey = []
    }
    // update state
    for (let uuid in delta) {
        state.users[uuid].x += delta[uuid].x
        state.users[uuid].y += delta[uuid].y
    }

    //broadcast
    for (let uuid in socket_connections) {
        let current_connection = socket_connections[uuid]
        current_connection.emit('/update', state)
    }

}, 1000 / config.FPS)

http.listen(config.PORT, (err) => {
    if (err) {
        console.error(err)
    }
    console.log(`listening on ${config.PORT}`)
})