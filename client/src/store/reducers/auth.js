import {
   CLEAR_USER,
   GET_USER,
   SET_LOADING_AUTH,
   REMOVE_LOADING_AUTH,
   SET_VERIFICATION_ALERT,
   REMOVE_VERIFICATION_ALERT,
   DELETE_ACCOUNT,
} from '../actions/types'

const initialState = {
   isAuthenticated: false,
   user: null,
   verificationAlert: false,
   loading: false,
}

export default function (state = initialState, action) {
   const { type, payload } = action

   switch (type) {
      case GET_USER:
         return {
            ...state,
            isAuthenticated: true,
            user: payload,
            loading: false,
         }
      case SET_LOADING_AUTH:
         return {
            ...state,
            loading: true,
         }
      case REMOVE_LOADING_AUTH:
         return {
            ...state,
            loading: false,
         }
      case SET_VERIFICATION_ALERT:
         return {
            ...state,
            verificationAlert: true,
         }
      case REMOVE_VERIFICATION_ALERT:
         return {
            ...state,
            verificationAlert: false,
         }
      case CLEAR_USER:
      case DELETE_ACCOUNT:
         localStorage.removeItem('token')
         return {
            ...state,
            isAuthenticated: false,
            user: null,
            verificationAlert: false,
            loading: false,
         }
      default:
         return state
   }
}
