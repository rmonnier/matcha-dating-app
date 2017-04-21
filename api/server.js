import express        from 'express'
const app              = express()
const port             = 8000

import mongoose       from 'mongoose'
import jwt            from 'jsonwebtoken'

import morgan      	  from 'morgan'
import cookieParser 	from 'cookie-parser'
import bodyParser   	from 'body-parser'
import fileUpload	  	from 'express-fileupload'
import path           from 'path'

import config         from './config/config.js'
import routes from './routes.js'

// configuration ===============================================================
mongoose.connect(config.database) // connect to our database
app.set('superSecret', config.secret)

app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(fileUpload())
app.use(express.static(path.join(__dirname, 'dist'), {
  dotfiles: 'ignore',
  index: false
}))

const apiRoutes = express.Router()
routes(apiRoutes)
app.use('/api', apiRoutes)

// launch ======================================================================
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));
app.listen(port)
console.log('The magic happens on port ' + port)
