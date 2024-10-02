const express = require('express')
const colors = require('colors')
const morgon = require('morgan')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

//dotenv config
dotenv.config()

//mongodb connection
connectDB()

//rest objects
const app = express()

//middleware
app.use(express.json())
app.use(morgon('dev'))

//routes
app.use('/api/v1/user', require('./routes/userRoutes'))
app.use('/api/v1/admin', require('./routes/adminRoutes'))
app.use('/api/v1/doctor', require('./routes/doctorRoutes'))

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server start at ${PORT}`)
})
