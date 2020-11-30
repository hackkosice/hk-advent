const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 8080
const isDev = app.get('env') === 'development'

app.use(express.static(path.resolve(__dirname, 'build')))

app.get('/api', (_, res) => {
    res.status(200).json({status: 'ok'})
})

app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})

app.listen(port, () => console.log(`Listen on ${port}`))
