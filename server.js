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

require('./socket_handler')(http)

// setInterval(()=>{
//     for (connection of socket_connections) {
//         connection.emit('/update', {
//
//         })
//     }
// }, 1000 / config.FPS)

http.listen(config.PORT, (err) => {
    if (err) {
        console.error(err)
    }
    console.log(`listening on ${config.PORT}`)
})