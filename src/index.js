const express = require('express')
require('./db/mongoose')
const articleRouter = require('./routers/article')
const authorRouter = require('./routers/author')
const reviewRouter = require('./routers/review')

const app = express()
const port = 3001

app.use(express.json())
app.use(articleRouter)
app.use(authorRouter)
app.use(reviewRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})