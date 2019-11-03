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

setInterval(()=>{
    for (let uuid in socket_connections) {
        let current_connection = socket_connections[uuid]
        current_connection.emit('/update', {
            users: [
                {
                    x: 10,
                    y: 10
                },
                {
                    x: 50,
                    y: 50
                }
            ]
        })
    }
}, 1000 / config.FPS)

http.listen(config.PORT, (err) => {
    if (err) {
        console.error(err)
    }
    console.log(`listening on ${config.PORT}`)
})