import fileUpload  from 'express-fileupload'
import express  from 'express'
import bodyParser  from 'body-parser'


const app = express();

app.use(fileUpload({preserveExtension: true}))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  next()
})
import indexRoutes from './routes/index-routes.js'
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



app.use('/', indexRoutes);

export default app;