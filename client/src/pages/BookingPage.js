import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import axios from 'axios'
import { DatePicker, TimePicker, message } from 'antd'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { showLoading, hideLoading } from '../redux/features/alertSlice'

const BookingPage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const params = useParams()
  const [doctor, setDoctor] = useState([])
  const [date, setDate] = useState()
  const [time, setTime] = useState()
  const [isAvailibale, setIsAvailibale] = useState(false)
  // login user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        '/api/v1/doctor/getDoctorById',
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        },
      )
      if (res.data.success) {
        setDoctor(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  //========================handleBooking=====================
  const handleBooking = async () => {
    try {
      setIsAvailibale(true)
      if (!date && !time) {
        return alert('Date and Time is Required')
      }
      dispatch(showLoading())
      const res = await axios.post(
        '/api/v1/user/book-appointment',
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      dispatch(hideLoading())
      if (res.data.success) {
        message.success(res.data.message)
      }
    } catch (error) {
      dispatch(hideLoading())
      console.log(error)
    }
  }

  //==============handle Availabilty===============
  const handleAvailability = async () => {
    try {
      dispatch(showLoading())
      const res = await axios.post(
        '/api/v1/user/booking-availbility',
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      dispatch(hideLoading())
      if (res.data.success) {
        setIsAvailibale(true)
        message.success(res.data.message)
      } else {
        setIsAvailibale(true)
        message.error(res.data.message)
      }
    } catch (error) {
      dispatch(hideLoading())
      console.log(error)
    }
  }
  useEffect(() => {
    getUserData()
    //eslint-disable-next-line
  }, [])
  return (
    <Layout>
      <h3 className="text-center">BookingPage</h3>
      <div className="container">
        {doctor && (
          <div>
            <h4>
              Dr. {doctor.firstName} {doctor.lastName}
            </h4>
            <h4>Fees: {doctor.feesPerCunsaltation}</h4>
            <h4>
              Timings : {doctor.timings && doctor.timings[0]} -{' '}
              {doctor.timings && doctor.timings[1]}{' '}
            </h4>
            <div className="d-flex flex-column w-50">
              <DatePicker
                className="m-2"
                format="DD-MM-YYYY"
                onChange={(value) => {
                  // setIsAvailibale(false)
                  setDate(moment(value).format('DD-MM-YYYY'))
                }}
              />
              <TimePicker
                className="m-2"
                format="HH:mm"
                onChange={(value) => {
                  // setIsAvailibale(false)
                  setTime(moment(value).format('HH:mm'))
                }}
              />
              <button
                className="btn btn-primary mt-2"
                onClick={handleAvailability}
              >
                Check Availability
              </button>
              <button className="btn btn-dark mt-2" onClick={handleBooking}>
                Book Now
              </button>
              {/* {!isAvailibale && (
                <button className="btn btn-dark mt-2" onClick={handleBooking}>
                  Book Now
                </button>
              )} */}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default BookingPage
