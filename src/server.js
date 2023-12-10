const { writeFileSync } = require('fs')
const express = require('express')
const app = express()
const { port, mySql } = require('./config/config')
const userRouter = require('./api/routers/user')
const imageRouter = require('./api/routers/image')
const newsRouter = require('./api/routers/news')
const adviseRouter = require('./api/routers/advise')
const fieldRouter = require('./api/routers/field')
const specializedRouter = require('./api/routers/specialized')
const packageRouter = require('./api/routers/package')
const db = require('./api/helpers/database')

app.use(express.json())
app.use(
    express.urlencoded({
        extended: true
    })
)

app.get('/', (req, res, next) => {
    res.json({ code: 200, message: "ok" })
})

// Router
app.use('/resources', express.static(__dirname + '/resources'))
app.use('/user', userRouter)
app.use('/image', imageRouter)
app.use('/news', newsRouter)
app.use('/advise', adviseRouter)
app.use('/field', fieldRouter)
app.use('/specialized', specializedRouter)
app.use('/package', packageRouter)

// Error
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    // Cần thiết thì lấy thêm id của requst, chặn nó nếu spam request
    writeFileSync(
        './src/api/log/log.txt',
        `============================================================================
        ${Date()}
        message: ${err.message}
        stack: ${err.stack}\n`,
        { flag: 'a' }
    )
    res.status(statusCode).json({
        code: statusCode,
        message: err.message
    })
})

app.listen(port, () => {
    db.execute('SET GLOBAL event_scheduler="ON"')
    console.log(`App listening at http://${mySql.host}:${port}`)
})