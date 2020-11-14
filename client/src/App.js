import React, { useEffect } from 'react'
import {
   BrowserRouter as Router,
   Route,
   Switch,
   useHistory,
} from 'react-router-dom'

import Navigation from './components/navigation/Navigation'
import Alert from './components/alert/Alert'
import Home from './components/home/Home'
import Login from './components/login/Login'
import Register from './components/register/Register'
import Topics from './components/topics/Topics'
import Topic from './components/topics/Topic'
import Profile from './components/profile/Profile'
import UpdateProfile from './components/profile/UpdateProfile'
import OthersProfile from './components/profile/OthersProfile'
import Settings from './components/settings/Settings'
import ChangePassword from './components/password/ChangePassword'
import ForgotPasswordLink from './components/password/ForgotPasswordLink'
import ForgotPassword from './components/password/ForgotPassword'
import VerifyEmail from './components/verifyEmail/VerifyEmail'
import NotFound from './components/notFound/NotFound'

import { getAuthenticatedUser } from './store/actions/auth'

// Redux
import { Provider } from 'react-redux'
import store from './store/store'

const Routing = () => {
   const history = useHistory()
   useEffect(() => {
      store.dispatch(getAuthenticatedUser(history))
   }, [])
   return (
      <Switch>
         <Route exact path='/' component={Home} />
         <Route path='/login' component={Login} />
         <Route path='/register' component={Register} />
         <Route exact path='/topics' component={Topics} />
         <Route path='/topics/:id' component={Topic} />
         <Route exact path='/profile' component={Profile} />
         <Route
            exact
            path='/profile/update-profile'
            component={UpdateProfile}
         />
         <Route exact path='/profile/:user_id' component={OthersProfile} />
         <Route path='/settings' component={Settings} />
         <Route path='/changepassword' component={ChangePassword} />
         <Route path='/forgotpasswordlink' component={ForgotPasswordLink} />
         <Route
            exact
            path='/forgotpassword/:token'
            component={ForgotPassword}
         />
         <Route path='/verifyemail/:token' component={VerifyEmail} />
         <Route path='/notfound' component={NotFound} />
         <Route component={NotFound} />
      </Switch>
   )
}

const App = () => {
   return (
      <Provider store={store}>
         <Router>
            <Navigation />
            <Alert />
            <Routing />
         </Router>
      </Provider>
   )
}

export default App
