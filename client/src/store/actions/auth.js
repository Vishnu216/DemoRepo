import axios from 'axios'

import {
   CLEAR_USER,
   GET_USER,
   SET_LOADING_AUTH,
   REMOVE_LOADING_AUTH,
   SET_VERIFICATION_ALERT,
   CLEAR_PROFILE,
   REMOVE_VERIFICATION_ALERT,
   CLEAR_TOPICS,
   DELETE_ACCOUNT,
} from './types'
import { setAlert } from './alert'

// Disable verification alert
export const disableVerificationAlert = () => async (dispatch) => {
   dispatch({
      type: REMOVE_VERIFICATION_ALERT,
   })
}

// Get authenticated user
export const getAuthenticatedUser = (history) => async (dispatch) => {
   try {
      const token = localStorage.getItem('token')
      if (!token) {
         if (
            history.location.pathname === '/register' ||
            history.location.pathname === '/' ||
            history.location.pathname === '/forgotpasswordlink' ||
            history.location.pathname.includes('/forgotpassword/')
         ) {
            return
         }
         history.push('/login')
         return
      }

      const config = {
         headers: {
            'x-auth-token': token,
         },
      }
      dispatch({
         type: SET_LOADING_AUTH,
      })
      const res = await axios.get('/getuser', config)
      dispatch({
         type: GET_USER,
         payload: res.data,
      })
   } catch (err) {
      dispatch({
         type: REMOVE_LOADING_AUTH,
      })
      const errors = err.response.data.errors

      if (errors) {
         errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
      }
      localStorage.removeItem('token')
      history.push('/login')
   }
}

// Register user
export const register = ({ name, email, password }, history) => async (
   dispatch
) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'application/json',
         },
      }

      const body = JSON.stringify({ name, email, password })

      dispatch({
         type: SET_LOADING_AUTH,
      })

      const res = await axios.post('/register', body, config)

      localStorage.setItem('token', res.data.token)

      dispatch({
         type: GET_USER,
         payload: res.data.user,
      })

      dispatch(setAlert(res.data.msg, 'success'))

      history.push('/topics')
   } catch (err) {
      dispatch({
         type: REMOVE_LOADING_AUTH,
      })

      const errors = err.response.data.errors

      if (errors) {
         errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
      }
   }
}

// Login user
export const login = ({ email, password }, history) => async (dispatch) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'application/json',
         },
      }

      const body = JSON.stringify({ email, password })

      dispatch({
         type: SET_LOADING_AUTH,
      })

      const res = await axios.post('/login', body, config)

      localStorage.setItem('token', res.data.token)

      dispatch({
         type: GET_USER,
         payload: res.data.user,
      })

      dispatch({
         type: SET_VERIFICATION_ALERT,
      })

      history.push('/topics')
   } catch (err) {
      dispatch({
         type: REMOVE_LOADING_AUTH,
      })

      const errors = err.response.data.errors

      if (errors) {
         errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
      }
   }
}

// Change password
export const changePassword = ({ oldPassword, password }, history) => async (
   dispatch
) => {
   try {
      dispatch({
         type: SET_LOADING_AUTH,
      })

      const config = {
         headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token'),
         },
      }

      const body = JSON.stringify({ oldPassword, password })

      const res = await axios.patch('/changepassword', body, config)

      dispatch({
         type: REMOVE_LOADING_AUTH,
      })

      dispatch(setAlert(res.data.msg, 'success'))

      history.push('/settings')
   } catch (err) {
      dispatch({
         type: REMOVE_LOADING_AUTH,
      })

      const errors = err.response.data.errors

      if (errors) {
         errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
      }
   }
}

// Forgot password link
export const forgotPasswordLink = ({ email }, history) => async (dispatch) => {
   try {
      dispatch({
         type: SET_LOADING_AUTH,
      })

      const config = {
         headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token'),
         },
      }

      const body = JSON.stringify({ email })

      const res = await axios.post('/forgotpasswordlink', body, config)

      dispatch({
         type: REMOVE_LOADING_AUTH,
      })

      dispatch(setAlert(res.data.msg, 'success'))

      history.push('/login')
   } catch (err) {
      dispatch({
         type: REMOVE_LOADING_AUTH,
      })

      const errors = err.response.data.errors

      if (errors) {
         errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
      }
   }
}

// Forgot password
export const forgotPassword = ({ password, token }, history) => async (
   dispatch
) => {
   try {
      dispatch({
         type: SET_LOADING_AUTH,
      })

      const config = {
         headers: {
            'Content-Type': 'application/json',
         },
      }

      const body = JSON.stringify({ password, token })

      const res = await axios.patch('/forgotpassword', body, config)

      dispatch({
         type: REMOVE_LOADING_AUTH,
      })

      dispatch(setAlert(res.data.msg, 'success'))

      history.push('/login')
   } catch (err) {
      dispatch({
         type: REMOVE_LOADING_AUTH,
      })

      const errors = err.response.data.errors

      if (errors) {
         errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
      }
   }
}

// Resend verification email
export const resendVerificationEmail = (email) => async (dispatch) => {
   try {
      dispatch({
         type: SET_LOADING_AUTH,
      })

      const config = {
         headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token'),
         },
      }

      const body = JSON.stringify({ email })

      const res = await axios.post('/verifyemaillink', body, config)

      dispatch({
         type: REMOVE_LOADING_AUTH,
      })

      dispatch(setAlert(res.data.msg, 'success'))
   } catch (err) {
      dispatch({
         type: REMOVE_LOADING_AUTH,
      })

      const errors = err.response.data.errors

      if (errors) {
         errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
      }
   }
}

// Verify email
export const verifyMail = (token, history) => async (dispatch) => {
   try {
      dispatch({
         type: SET_LOADING_AUTH,
      })

      const config = {
         headers: {
            'Content-Type': 'application/json',
         },
      }

      const body = JSON.stringify({ token })

      const res = await axios.patch('/verifyemail', body, config)

      dispatch({
         type: GET_USER,
         payload: res.data.user,
      })

      dispatch(setAlert(res.data.msg, 'success'))

      history.push('/topics')

      setTimeout(() => {
         window.location.reload()
      }, 1000)
   } catch (err) {
      dispatch({
         type: REMOVE_LOADING_AUTH,
      })

      const errors = err.response.data.errors

      if (errors) {
         errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
      }
   }
}

export const deleteAccount = (history) => async (dispatch) => {
   try {
      dispatch({
         type: SET_LOADING_AUTH,
      })

      const config = {
         headers: {
            'x-auth-token': localStorage.getItem('token'),
         },
      }

      await axios.delete('/deleteaccount', config)

      dispatch({
         type: DELETE_ACCOUNT,
      })

      dispatch({
         type: CLEAR_PROFILE,
      })

      dispatch({
         type: CLEAR_TOPICS,
      })

      history.push('/login')
      dispatch(setAlert('Account has been deleted!', 'success'))
   } catch (err) {
      dispatch({
         type: REMOVE_LOADING_AUTH,
      })

      dispatch(setAlert('Cannot delete account!', 'danger'))
   }
}

// Logout / Clear profile / Clear topics
export const logout = (history) => (dispatch) => {
   dispatch({
      type: CLEAR_USER,
   })

   dispatch({
      type: CLEAR_PROFILE,
   })

   dispatch({
      type: CLEAR_TOPICS,
   })

   history.push('/login')
}
