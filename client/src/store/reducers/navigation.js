import { EXPANDED } from '../actions/types'

const initialState = {
   expanded: false,
}

export default function (state = initialState, action) {
   const { type, payload } = action

   switch (type) {
      case EXPANDED:
         return {
            ...state,
            expanded: payload,
         }
      default:
         return state
   }
}
