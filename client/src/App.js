import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Register from './pages/Register'
import Login from './pages/Login'
import { UseSelector, useSelector } from 'react-redux'
import Spinner from './components/Spinner'
import ProtectedRoutes from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import ApplyDoctor from './pages/ApplyDoctor'
import NotificationPage from './pages/NotificationPage'
import Users from './pages/admin/Users'
import Doctors from './pages/admin/Doctors'
import Profile from './pages/doctor/Profile'
import BookingPage from './pages/BookingPage'
import Appointments from './pages/Appointments'
import DoctorAppointments from './pages/doctor/DoctorAppointments'

const App = () => {
  const { loading } = useSelector((state) => state.alerts)
  return (
    <>
      <BrowserRouter>
        {loading ? (
          <Spinner />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoutes>
                  <HomePage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/apply-doctor"
              element={
                <ProtectedRoutes>
                  <ApplyDoctor />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoutes>
                  <Users />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoutes>
                  <Doctors />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/notification"
              element={
                <ProtectedRoutes>
                  <NotificationPage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/doctor/profile/:id"
              element={
                <ProtectedRoutes>
                  <Profile />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/doctor/book-appointment/:doctorId"
              element={
                <ProtectedRoutes>
                  <BookingPage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/appointment"
              element={
                <ProtectedRoutes>
                  <Appointments />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/doctor-appointments"
              element={
                <ProtectedRoutes>
                  <DoctorAppointments />
                </ProtectedRoutes>
              }
            />
          </Routes>
        )}
      </BrowserRouter>
    </>
  )
}

export default App
