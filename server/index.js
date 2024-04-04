require('dotenv').config()
const express = require('express')
const cors = require('cors')
const server = express()
const response = require('./src/utils/responses')
const port = process.env.APP_PORT
const mongoose = require('mongoose')
const router = require('./src/routes/routes')

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(router)

server.all('*', (req, res, next) => {
    response(res, 404, 'Page not found.')
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        server.listen(port, () => {
            console.log('DB connected')
            console.log(`Server is running on ${process.env.BASE_URL}\n`)
        })
    }).catch((error) => {
        console.log(error.message)
    })