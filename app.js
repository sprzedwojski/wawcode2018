/**
 * Module dependencies.
 */
const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const logger = require('morgan')
const chalk = require('chalk')
const errorHandler = require('errorhandler')
const dotenv = require('dotenv')
const path = require('path')
const expressValidator = require('express-validator')
const expressStatusMonitor = require('express-status-monitor')
const sass = require('node-sass-middleware')
const cors = require('cors')

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: 'process.env' })

/**
 * Controllers (route handlers).
 */
const testController = require('./controllers/test')
const poiController = require('./controllers/poiController')
const googleApi = require('./googleApi')

/**
 * Create Express server.
 */
const app = express()
app.use(cors())

/**
 * Connect to MongoDB.
 */
// mongoose.Promise = global.Promise
// mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI)
// mongoose.connection.on('error', (err) => {
//     console.error(err)
//     console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'))
//     process.exit()
// })

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0')
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3001)
app.use(expressStatusMonitor())
app.use(compression())
app.use(sass({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public')
}))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressValidator())
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }))
app.use(express.static(path.join(__dirname, 'frontend', 'build')))

/**
 * Primary app routes.
 */
// app.get('/', homeController.index)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
})
app.get('/api/test', testController.test)
app.get('/api/pois', poiController.getPois)
app.post('/api/pois', poiController.addPoi)
app.get('/api/google', googleApi.test)
app.post('/api/pois/:id', poiController.editPoi)

// Admin
app.post('/api/admin/pois/:id', poiController.editPoiAdmin)
app.get('/api/admin/pois/all', poiController.getOurPois)

/**
 * Error Handler.
 */
app.use(errorHandler())

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'))
    console.log('  Press CTRL-C to stop\n')
})

module.exports = app
