import React from 'react'
import '../styles/LoginStyles.css'
import { Form, Input, message } from 'antd'
import { useDispatch } from 'react-redux'
import { showLoading, hideLoading } from '../redux/features/alertSlice'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading())
      const res = await axios.post('/api/v1/user/login', values)
      dispatch(hideLoading())
      if (res.data.success) {
        localStorage.setItem('token', res.data.token)
        message.success('Login SuccessFully')
        navigate('/')
      } else {
        message.error(res.data.message)
      }
    } catch (error) {
      dispatch(hideLoading())
      console.log(error)
      message.error('Something Went Wrong')
    }
  }
  return (
    <>
      <div className="form-container">
        <Form
          layout="vertical"
          onFinish={onfinishHandler}
          className="register-form"
        >
          <h1 className="text-center">Sing In</h1>
          <Form.Item label="Email" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="passwords" required />
          </Form.Item>
          <Link to="/register" className="m-2">
            Not a user SingUp here
          </Link>
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </Form>
      </div>
    </>
  )
}

export default Login
