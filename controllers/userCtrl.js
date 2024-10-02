const userModel = require('../models/userModels')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctorModel = require('../models/doctorModel')
const appointmentModel = require('../models/appointmentModel')
const moment = require('moment')

//register callback
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email })
    if (existingUser) {
      return res.status(200).send({
        message: 'User Already Exist',
        success: false,
      })
    }
    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    req.body.password = hashedPassword

    const newUser = new userModel(req.body)
    await newUser.save()
    res.status(201).send({ message: 'Register Sucessfully', success: true })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    })
  }
}

//Login controller
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(200).send({ message: 'User Not Found', success: false })
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: 'Invalid Emial or Password', success: false })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })
    res.status(200).send({ message: 'Login Sucess', success: true, token })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: `Error in Login CTRL -${error.message}` })
  }
}

//Auth Controller || get user data
const authController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId })
    user.password = undefined
    if (!user) {
      return res.status(200).send({
        message: 'User Not Found',
        success: false,
      })
    } else {
      res.status(200).send({
        success: true,
        data: user,
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: 'auth error',
      success: false,
      error,
    })
  }
}

//apply doctor ctrl
const applyDoctorController = async (req, res) => {
  try {
    const newdoctor = await doctorModel({ ...req.body, status: 'pending' })
    await newdoctor.save()
    const adminUser = await userModel.findOne({ isAdmin: true })
    const notification = adminUser.notification
    notification.push({
      type: 'Apply-doctor-request',
      message: `${newdoctor.firstName} ${newdoctor.lastName} Has Applied For Doctor Account`,
      data: {
        doctorId: newdoctor._id,
        name: newdoctor.firstName + ' ' + newdoctor.lastName,
        onClickPath: '/admin/doctor',
      },
    })
    await userModel.findByIdAndUpdate(adminUser._id, { notification })
    res.status(201).send({
      success: true,
      message: 'Doctor Account Applied Successfully',
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: true,
      error,
      message: 'Error while Apply For Doctor',
    })
  }
}

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId })
    const seennotification = user.seennotification
    const notification = user.notification
    seennotification.push(...notification)
    user.notification = []
    // user.seennotification = notification
    const updatedUser = await user.save()
    res.status(200).send({
      success: true,
      message: 'all notification marked as read',
      data: updatedUser,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: 'Error in notification',
      success: false,
      error,
    })
  }
}
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId })
    user.notification = []
    user.seennotification = []
    const updatedUser = await user.save()
    updatedUser.password = undefined
    res.status(200).send({
      success: true,
      message: 'Notification Deleted Successfully',
      data: updatedUser,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: 'Unable to Delete all notification',
      success: false,
      error,
    })
  }
}

//getAllDoctorController details
const getAllDoctorController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: 'approved' })
    res.status(200).send({
      success: true,
      message: 'Doctor Lists Fetched Successfully',
      data: doctors,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: 'Unable to Get All Doctor List',
      success: false,
      error,
    })
  }
}

// book Appointment Controller
const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString()
    req.body.time = moment(req.body.time, 'HH:mm').toISOString()
    req.body.status = 'pending'
    const newAppointment = new appointmentModel(req.body)
    await newAppointment.save()
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId })
    user.notification.push({
      type: 'New-appointment-request',
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onCLickPath: '/user/appointments',
    })
    await user.save()
    res.status(200).send({
      success: true,
      message: 'Appointment Book succesfully',
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: 'Error While Booking Appointment',
    })
  }
}

//bookingAvailbilityController
const bookingAvailbilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, 'DD-MM-YY').toISOString()
    const fromTime = moment(req.body.time, 'HH:mm')
      .subtract(1, 'hours')
      .toISOString()
    const toTime = moment(req.body.time, 'HH:mm').add(1, 'hours').toISOString()
    const doctorId = req.body.doctorId
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    })
    if (appointments.length > 0) {
      return res.status(200).send({
        success: true,
        message: 'Appointment Not Available at this time',
      })
    } else {
      return res.status(200).send({
        success: true,
        message: 'Appointment Available',
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error In Checking Avilbility',
      error,
    })
  }
}

//user Appointment Controller
const userAppointmentController = async (req, res) => {
  try {
    const appointment = await appointmentModel.find({ userId: req.body.userId })
    res.status(200).send({
      success: true,
      message: 'Users Appointment Fetched Successfully',
      data: appointment,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error In Geting Appointment List',
      error,
    })
  }
}
module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorController,
  bookAppointmentController,
  bookingAvailbilityController,
  userAppointmentController,
}
