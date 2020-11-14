import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Link, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { setAlert } from '../../store/actions/alert'
import { register } from '../../store/actions/auth'
import { setExpanded } from '../../store/actions/navigation'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from '../spinner/Spinner'

const Register = ({
   isAuthenticated,
   setAlert,
   register,
   setExpanded,
   expanded,
   loading,
}) => {
   const history = useHistory()

   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      password2: '',
   })

   const [err, setErr] = useState({
      nameErr: '',
      emailErr: '',
      passwordErr: '',
      password2Err: '',
   })

   const { name, email, password, password2 } = formData

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
         case 'name':
            errors.nameErr =
               value.length < 3 ? 'Name must be 3 characters long!' : ''
            break
         case 'email':
            errors.emailErr = validEmailRegex.test(value)
               ? ''
               : 'Email is not valid!'
            break
         case 'password':
            errors.passwordErr =
               value.length < 6 ? 'Password must be 6 characters long!' : ''
            break
         case 'password2':
            errors.password2Err =
               password !== value ? 'Passwords do not match' : ''
            break
         default:
            break
      }
      setFormData({ ...formData, [name]: value })

      setErr({ ...errors, errors })
   }

   const onSubmit = (e) => {
      e.preventDefault()

      if (name === '' || email === '' || password === '' || password2 === '') {
         setAlert('Fields cannot be empty!', 'danger')
         return
      }
      if (validateForm(err)) {
         register({ name, email, password }, history)
      } else {
         setAlert('Cannot Register!', 'danger')
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
               className='Register d-flex flex-column justify-content-center align-items-center'
               onClick={() => {
                  if (expanded) {
                     setExpanded(false)
                  }
               }}
            >
               <Row className='Register__row'>
                  <Col>
                     <Card className='Register__card--width'>
                        <Card.Header className='text-center text-primary Register__header--size'>
                           REGISTER
                        </Card.Header>
                        <Card.Body>
                           <Form onSubmit={(e) => onSubmit(e)}>
                              <Form.Group>
                                 <Form.Control
                                    type='text'
                                    placeholder='Enter your name'
                                    name='name'
                                    value={name}
                                    onChange={(e) => onChange(e)}
                                 />
                                 {err.nameErr.length > 0 && (
                                    <span style={{ color: 'red' }}>
                                       {err.nameErr}
                                    </span>
                                 )}
                              </Form.Group>
                              <Form.Group>
                                 <Form.Control
                                    type='email'
                                    placeholder='Enter your email'
                                    name='email'
                                    value={email}
                                    onChange={(e) => onChange(e)}
                                 />
                                 {err.emailErr.length > 0 && (
                                    <span style={{ color: 'red' }}>
                                       {err.emailErr}
                                    </span>
                                 )}
                              </Form.Group>
                              <Form.Group>
                                 <Form.Control
                                    type='password'
                                    placeholder='Enter your password'
                                    name='password'
                                    value={password}
                                    onChange={(e) => onChange(e)}
                                 />
                                 {err.passwordErr.length > 0 && (
                                    <span style={{ color: 'red' }}>
                                       {err.passwordErr}
                                    </span>
                                 )}
                              </Form.Group>
                              <Form.Group>
                                 <Form.Control
                                    type='password'
                                    placeholder='Confirm your password'
                                    name='password2'
                                    value={password2}
                                    onChange={(e) => onChange(e)}
                                 />
                                 {err.password2Err.length > 0 && (
                                    <span style={{ color: 'red' }}>
                                       {err.password2Err}
                                    </span>
                                 )}
                              </Form.Group>
                              <Button type='submit' variant='primary' block>
                                 Register
                              </Button>
                           </Form>
                        </Card.Body>
                        <Card.Footer className='text-muted text-center'>
                           Already have an account?&nbsp;
                           <Link
                              to='/login'
                              className='btn btn-outline-primary ml-1'
                              onClick={() => {
                                 if (expanded) {
                                    setExpanded(false)
                                 }
                              }}
                           >
                              Login
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

Register.propTypes = {
   isAuthenticated: PropTypes.bool.isRequired,
   register: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
   setExpanded: PropTypes.func.isRequired,
   loading: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
   isAuthenticated: state.auth.isAuthenticated,
   expanded: state.navigation.expanded,
   loading: state.auth.loading,
})

export default connect(mapStateToProps, { setAlert, register, setExpanded })(
   Register
)
