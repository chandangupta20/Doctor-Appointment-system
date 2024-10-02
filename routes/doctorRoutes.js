const express = require('express')
const auuthMiddleware = require('../middlewares/authMiddleware')
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentController,
  updateStatusController,
} = require('../controllers/doctorCtrl')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

//POST SINGLE DOCTOR
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController)

//POST UPDATE PROFILE
router.post('/updateProfile', authMiddleware, updateProfileController)

//POST GET SINGLE DOC INFO
router.post('/getDoctorById', authMiddleware, getDoctorByIdController)

//GET Appointments
router.get('/doctor-appointments', authMiddleware, doctorAppointmentController)

//Update Appointments
router.post('/update-status', authMiddleware, updateStatusController)

module.exports = router
