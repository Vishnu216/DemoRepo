import axios from 'axios'
import { setAlert } from './alert'

import {
   GET_PROFILE,
   SET_LOADING_PROFILE,
   REMOVE_LOADING_PROFILE,
} from './types'

// Get authenticated user's profile
export const getMyProfile = () => async (dispatch) => {
   try {
      dispatch({
         type: SET_LOADING_PROFILE,
      })

      const token = localStorage.getItem('token')

      const config = {
         headers: {
            'x-auth-token': token,
         },
      }

      const res = await axios.get('/myprofile', config)

      dispatch({
         type: GET_PROFILE,
         payload: res.data,
      })
   } catch (err) {
      dispatch({
         type: REMOVE_LOADING_PROFILE,
      })
   }
}

// Get others profile
export const othersProfile = (user_id, history) => async (dispatch) => {
   try {
      dispatch({
         type: SET_LOADING_PROFILE,
      })

      const token = localStorage.getItem('token')

      const config = {
         headers: {
            'x-auth-token': token,
         },
      }

      const res = await axios.get(`/profile/${user_id}`, config)

      dispatch({
         type: GET_PROFILE,
         payload: res.data,
      })
   } catch (err) {
      dispatch({
         type: REMOVE_LOADING_PROFILE,
      })
      history.push('/notfound')
   }
}

// Update profile
export const updateProfile = (formData, image, history) => async (dispatch) => {
   try {
      const { bio, status, location } = formData
      let photo = ''

      dispatch({
         type: SET_LOADING_PROFILE,
      })

      if (image) {
         const data = new FormData()
         data.append('file', image)
         data.append('upload_preset', 'writivelabs')
         data.append('cloud_name', 'writive')
         const res = await axios.post(
            'https://api.cloudinary.com/v1_1/writive/image/upload',
            data
         )
         photo = res.data.url
      }

      const config = {
         headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token'),
         },
      }

      const body = JSON.stringify({ photo, bio, status, location })

      const res2 = await axios.patch('/updateprofile', body, config)

      dispatch({
         type: GET_PROFILE,
         payload: res2.data,
      })
      dispatch(setAlert('Profile Updated!', 'success'))
      history.push('/profile')
   } catch (err) {
      dispatch({
         type: REMOVE_LOADING_PROFILE,
      })

      dispatch(
         setAlert('Profile could not be updated. Please try again!', 'danger')
      )
   }
}
