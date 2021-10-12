require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()
const mongoose = require('mongoose')
const path = require("path");
const errorMiddleware = require('./middleware/error.middleware');


const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI

app.use(express.json())
app.use(cookieParser())
app.use(cors(
    {
    credentials: true,
    origin: process.env.CLIENT_URL
}
))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/links.routes'))
app.use('/t', require('./routes/redirect.routes'))
app.use(errorMiddleware);


if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'dist')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
    })
}

const start = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },  () => {
            console.log('MongoDB connected')
        })
        app.listen(PORT, () => console.log(`Server is running on ${PORT} port...`))

    } catch (e) {
        console.log('Server Error: ', e.message)
        process.exit(1)
    }
}

start()



