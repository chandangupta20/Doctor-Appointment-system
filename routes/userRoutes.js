const express = require('express')

const {
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
} = require('../controllers/userCtrl')
const authMiddleware = require('../middlewares/authMiddleware')

//router object
const router = express.Router()

//routes

//login || POST
router.post('/login', loginController)

//register || POST
router.post('/register', registerController)

//Auth || POST
router.post('/getUserData', authMiddleware, authController)

//Apply Doctor || POST
router.post('/apply-doctor', authMiddleware, applyDoctorController)

//Notification Doctor || POST
router.post(
  '/get-all-notification',
  authMiddleware,
  getAllNotificationController,
)

//Delete Notification Doctor || POST
router.post(
  '/delete-all-notification',
  authMiddleware,
  deleteAllNotificationController,
)

//GET ALL DOC
router.get('/getAllDoctor', authMiddleware, getAllDoctorController)

//GET ALL DOC
router.post('/book-appointment', authMiddleware, bookAppointmentController)

//BOOKING AVLIABILITY
router.post(
  '/booking-availbility',
  authMiddleware,
  bookingAvailbilityController,
)

//Appointment List
router.get('/user-appointments', authMiddleware, userAppointmentController)

module.exports = router
