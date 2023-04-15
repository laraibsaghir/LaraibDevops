require('dotenv').config();
const {SECRET_KEY} = process.env
var dotenv =  require('dotenv')
var path = require('path')
var mongoose = require('mongoose');
var express= require('express')
var colors = require('colors')
var morgan = require('morgan')
var { notFound, errorHandler } =  require('./middleware/errorMiddleware.js')
var connectDB = require('./config/db.js')

var productRoutes = require('./routes/productRoutes.js')
var userRoutes = require('./routes/userRoutes.js')
var orderRoutes = require('./routes/orderRoutes.js')
var uploadRoutes = require('./routes/uploadRoutes.js')

dotenv.config()
var connection = mongoose.connect('mongodb://localhost:27017/GirlPower', 
    { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('strictQuery', true);
var app = express();
connection.then((db) => {
    console.log("Connected correctly to server");
  },
   (err) => {  
      console.log(err); 
    });



if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

var __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
