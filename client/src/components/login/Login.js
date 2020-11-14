import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Link, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { login } from '../../store/actions/auth'
import { setAlert } from '../../store/actions/alert'
import { setExpanded } from '../../store/actions/navigation'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from '../spinner/Spinner'

const Login = ({
   isAuthenticated,
   login,
   setAlert,
   setExpanded,
   expanded,
   loading,
}) => {
   const history = useHistory()

   const [formData, setFormData] = useState({
      email: '',
      password: '',
   })

   const [err, setErr] = useState({
      emailErr: '',
      passwordErr: '',
   })

   const { email, password } = formData

   const validEmailRegex = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)

   const validateForm = (errors) => {
      let valid = true
      Object.values(errors).forEach((val) => val.length > 0 && (valid = false))
      return valid
   }

   const onChange = (e) => {
      let errors = err
      const { name, value } = e.target

      switch (name) {
         case 'email':
            errors.emailErr = validEmailRegex.test(value)
               ? ''
               : 'Email is not valid!'
            break
         case 'password':
            errors.passwordErr =
               value.length < 6 ? 'Password must be 6 characters long!' : ''
            break
         default:
            break
      }
      setFormData({ ...formData, [name]: value })

      setErr({ ...errors, errors })
   }

   const onSubmit = (e) => {
      e.preventDefault()

      if (email === '' || password === '') {
         setAlert('Invalid Credentials!', 'danger')
         return
      }

      if (validateForm(err)) {
         login({ email, password }, history)
      } else {
         setAlert('Invalid Credentials!', 'danger')
      }
   }

   if (isAuthenticated) {
      return <Redirect to='/topics' />
   }

   return (
      <Fragment>
         {loading ? (
            <Spinner />
         ) : (
            <Container
               className='Login d-flex flex-column justify-content-center align-items-center'
               onClick={() => {
                  if (expanded) {
                     setExpanded(false)
                  }
               }}
            >
               <Row className='Login__row'>
                  <Col>
                     <Card className='Login__card--width'>
                        <Card.Header className='text-center text-primary Login__header--size'>
                           LOGIN
                        </Card.Header>
                        <Card.Body>
                           <Form onSubmit={(e) => onSubmit(e)}>
                              <Form.Group>
                                 <Form.Control
                                    type='text'
                                    placeholder='Enter your email'
                                    name='email'
                                    value={email}
                                    onChange={(e) => onChange(e)}
                                 />
                              </Form.Group>
                              <Form.Group>
                                 <Form.Control
                                    type='password'
                                    placeholder='Enter your password'
                                    name='password'
                                    value={password}
                                    onChange={(e) => onChange(e)}
                                 />
                              </Form.Group>
                              <Button type='submit' variant='primary' block>
                                 Login
                              </Button>
                           </Form>
                        </Card.Body>
                        <Card.Footer className='text-muted text-center'>
                           Don't have an account?&nbsp;
                           <Link
                              to='/register'
                              className='btn btn-outline-primary ml-1'
                              onClick={() => {
                                 if (expanded) {
                                    setExpanded(false)
                                 }
                              }}
                           >
                              Register
                           </Link>
                           <Link
                              className='d-block mx-auto Login__forgotpassword'
                              to='/forgotpasswordlink'
                           >
                              Forgot Password?
                           </Link>
                        </Card.Footer>
                     </Card>
                  </Col>
               </Row>
            </Container>
         )}
      </Fragment>
   )
}

Login.propTypes = {
   isAuthenticated: PropTypes.bool.isRequired,
   login: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
   setExpanded: PropTypes.func.isRequired,
   loading: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
   isAuthenticated: state.auth.isAuthenticated,
   expanded: state.navigation.expanded,
   loading: state.auth.loading,
})

export default connect(mapStateToProps, { login, setAlert, setExpanded })(Login)
