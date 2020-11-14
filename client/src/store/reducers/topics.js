import {
   SET_LOADING_TOPICS,
   REMOVE_LOADING_TOPICS,
   GET_TOPICS,
   GET_TOPIC,
   ADD_TOPIC,
   DELETE_TOPIC,
   ADD_COMMENT,
   DELETE_COMMENT,
   CLEAR_TOPICS,
} from '../actions/types'

const initialState = {
   topics: [],
   topic: null,
   loading: false,
}

export default function (state = initialState, action) {
   const { type, payload } = action

   switch (type) {
      case SET_LOADING_TOPICS:
         return {
            ...state,
            loading: true,
         }
      case REMOVE_LOADING_TOPICS:
         return {
            ...state,
            loading: false,
         }
      case GET_TOPICS:
         return {
            ...state,
            topics: payload,
            loading: false,
         }
      case GET_TOPIC:
         return {
            ...state,
            topic: payload,
            loading: false,
         }
      case ADD_TOPIC:
         return {
            ...state,
            topics: [payload, ...state.topics],
            loading: false,
         }
      case DELETE_TOPIC:
         return {
            ...state,
            topics: state.topics.filter((topic) => topic._id !== payload),
            loading: false,
         }
      case ADD_COMMENT:
         return {
            ...state,
            topic: { ...state.topic, comments: payload },
            loading: false,
         }
      case DELETE_COMMENT:
         return {
            ...state,
            topic: {
               ...state.topic,
               comments: state.topic.comments.filter(
                  (comment) => comment._id !== payload
               ),
            },
            loading: false,
         }
      case CLEAR_TOPICS:
         return {
            ...state,
            topics: [],
            topic: null,
            loading: false,
         }
      default:
         return state
   }
}
