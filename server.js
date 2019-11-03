const express = require('express')
const app = express()
const config = require('./config')

app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.listen(config.PORT, (err) => {
    if (err) {
        console.error(err)
    }
    console.log(`listening on ${config.PORT}`)
})