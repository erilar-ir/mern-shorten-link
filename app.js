const express = require('express')
const config = require('config')
const app = express()
const mongoose = require('mongoose')
const path = require("path");

const PORT = config.get('port') || 5000
const MONGO_URI = config.get('mongoUri')


app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/links.routes'))
app.use('/t', require('./routes/redirect.routes'))

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



