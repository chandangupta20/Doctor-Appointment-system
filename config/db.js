const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
    })
    console.log(
      `Mongodb connected to ${mongoose.connection.host}`.bgGreen.white,
    )
  } catch (error) {
    console.log(`MongoDB Server Error: ${error}`.bgRed.white)
  }
}

module.exports = connectDB
