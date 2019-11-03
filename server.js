const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const http = require('http').createServer(app)
const uuid = require('uuid')

const socket_server = require('socket.io')(http);

const config = require('./config')


app.use(cookieParser())
app.use((req, res, next) => {
    const user_id = req.cookies.user_id
    if (!user_id) {
        res.cookie('user_id', uuid(), { maxAge: 900000, httpOnly: true });
    }
    next()
})

let socket_connections =  require('./socket_handler')(http)
require('./game/main.js')(socket_connections)

app.use(express.static('public'))
http.listen(config.PORT, (err) => {
    if (err) {
        console.error(err)
    }
    console.log(`listening on ${config.PORT}`)
})