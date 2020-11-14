import {
   GET_PROFILE,
   CLEAR_PROFILE,
   SET_LOADING_PROFILE,
   REMOVE_LOADING_PROFILE,
} from '../actions/types'

const initialState = {
   profile: null,
   loading: false,
}

export default function (state = initialState, action) {
   const { type, payload } = action

   switch (type) {
      case SET_LOADING_PROFILE:
         return {
            ...state,
            loading: true,
         }
      case REMOVE_LOADING_PROFILE:
         return {
            ...state,
            loading: false,
         }
      case GET_PROFILE:
         return {
            ...state,
            profile: payload,
            loading: false,
         }
      case CLEAR_PROFILE:
         return {
            ...state,
            profile: null,
            loading: false,
         }
      default:
         return state
   }
}
