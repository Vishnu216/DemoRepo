import axios from 'axios'
import { setAlert } from './alert'
import {
   SET_LOADING_TOPICS,
   REMOVE_LOADING_TOPICS,
   GET_TOPICS,
   GET_TOPIC,
   ADD_COMMENT,
   ADD_TOPIC,
   DELETE_TOPIC,
   DELETE_COMMENT,
} from './types'

// Get all topics
export const getTopics = () => async (dispatch) => {
   try {
      dispatch({
         type: SET_LOADING_TOPICS,
      })

      const token = localStorage.getItem('token')

      const config = {
         headers: {
            'x-auth-token': token,
         },
      }

      const res = await axios.get('/alltopics', config)

      dispatch({
         type: GET_TOPICS,
         payload: res.data,
      })
   } catch (err) {
      dispatch({
         type: REMOVE_LOADING_TOPICS,
      })
   }
}

// Get a particular topic
export const getTopic = (topic_id, history) => async (dispatch) => {
   try {
      dispatch({
         type: SET_LOADING_TOPICS,
      })

      const token = localStorage.getItem('token')

      const config = {
         headers: {
            'x-auth-token': token,
         },
      }

      const res = await axios.get(`/singletopic/${topic_id}`, config)

      dispatch({
         type: GET_TOPIC,
         payload: res.data,
      })
   } catch (err) {
      dispatch({
         type: REMOVE_LOADING_TOPICS,
      })

      history.push('/notfound')
   }
}

// Add topic
export const addTopic = ({ text, description }) => async (dispatch) => {
   try {
      // dispatch({
      //    type: SET_LOADING_TOPICS,
      // })

      const token = localStorage.getItem('token')

      const config = {
         headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
         },
      }

      description = description.split('\n')

      const body = JSON.stringify({ text, description })

      const res = await axios.post('/createtopic', body, config)
      dispatch({
         type: ADD_TOPIC,
         payload: res.data,
      })
      dispatch(setAlert('Topic Added!', 'success'))
   } catch (err) {
      // dispatch({
      //    type: REMOVE_LOADING_TOPICS,
      // })
      dispatch(setAlert('Cannot add topic!', 'danger'))
   }
}

// Delete a topic
export const deleteTopic = (topic_id) => async (dispatch) => {
   try {
      const token = localStorage.getItem('token')

      const config = {
         headers: {
            'x-auth-token': token,
         },
      }

      await axios.delete(`/deletetopic/${topic_id}`, config)

      dispatch({
         type: DELETE_TOPIC,
         payload: topic_id,
      })

      dispatch(setAlert('Topic Deleted!', 'success'))
   } catch (err) {
      dispatch(setAlert('Cannot delete topic!', 'danger'))
   }
}

// Add a comment
export const addComment = (topic_id, { text }) => async (dispatch) => {
   try {
      const token = localStorage.getItem('token')

      const config = {
         headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
         },
      }

      text = text.split('\n')

      const body = JSON.stringify({ text })

      const res = await axios.patch(`/createcomment/${topic_id}`, body, config)

      dispatch({
         type: ADD_COMMENT,
         payload: res.data,
      })
      dispatch(setAlert('Comment Added!', 'success'))
   } catch (err) {
      dispatch(setAlert('Cannot add comment!', 'danger'))
   }
}

// Delete a comment
export const deleteComment = (topic_id, comment_id) => async (dispatch) => {
   try {
      const token = localStorage.getItem('token')

      const config = {
         headers: {
            'x-auth-token': token,
         },
      }

      await axios.delete(`/deletecomment/${topic_id}/${comment_id}`, config)

      dispatch({
         type: DELETE_COMMENT,
         payload: comment_id,
      })
      dispatch(setAlert('Comment Deleted!', 'success'))
   } catch (err) {
      dispatch(setAlert('Cannot delete comment!', 'danger'))
   }
}
