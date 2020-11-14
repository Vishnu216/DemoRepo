import { combineReducers } from 'redux'

import alert from './alert'
import navigation from './navigation'
import auth from './auth'
import profile from './profile'
import topics from './topics'

export default combineReducers({ alert, navigation, auth, profile, topics })
