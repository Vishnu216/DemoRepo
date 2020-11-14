import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { setAlert } from '../../store/actions/alert'
import { setExpanded } from '../../store/actions/navigation'
import { changePassword } from '../../store/actions/auth'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from '../spinner/Spinner'

const ChangePassword = ({
   setExpanded,
   expanded,
   setAlert,
   changePassword,
   loading,
}) => {
   const history = useHistory()

   const [formData, setFormData] = useState({
      oldPassword: '',
      password: '',
      password2: '',
   })

   const [err, setErr] = useState({
      oldPasswordErr: '',
      passwordErr: '',
      password2Err: '',
   })

   const { oldPassword, password, password2 } = formData

   const validateForm = (errors) => {
      let valid = true
      Object.values(errors).forEach((val) => val.length > 0 && (valid = false))
      return valid
   }

   const onChange = (e) => {
      let errors = err
      const { name, value } = e.target

      switch (name) {
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

      if (oldPassword === '' || password === '' || password2 === '') {
         setAlert('Fields cannot be empty!', 'danger')
         return
      }
      if (validateForm(err)) {
         changePassword({ oldPassword, password }, history)
      } else {
         setAlert('Cannot change password!', 'danger')
      }
   }

   return (
      <Fragment>
         {loading ? (
            <Spinner />
         ) : (
            <Container
               className='ChangePassword d-flex flex-column justify-content-center align-items-center'
               onClick={() => {
                  if (expanded) {
                     setExpanded(false)
                  }
               }}
            >
               <Row className='ChangePassword__row'>
                  <Col>
                     <Card className='ChangePassword__card--width'>
                        <Card.Header className='text-center text-primary ChangePassword__header--size'>
                           CHANGE PASSWORD
                        </Card.Header>
                        <Card.Body>
                           <Form onSubmit={(e) => onSubmit(e)}>
                              <Form.Group>
                                 <Form.Control
                                    type='password'
                                    placeholder='Enter old password'
                                    name='oldPassword'
                                    value={oldPassword}
                                    onChange={(e) => onChange(e)}
                                 />
                              </Form.Group>

                              <Form.Group>
                                 <Form.Control
                                    type='password'
                                    placeholder='Enter new password'
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
                                    placeholder='Confirm new password'
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
                                 Change Password
                              </Button>
                           </Form>
                        </Card.Body>
                     </Card>
                  </Col>
               </Row>
            </Container>
         )}
      </Fragment>
   )
}

ChangePassword.propTypes = {
   setExpanded: PropTypes.func.isRequired,
   loading: PropTypes.bool.isRequired,
   setAlert: PropTypes.func.isRequired,
   changePassword: PropTypes.func.isRequired,
}

const mapStateTopProps = (state) => ({
   expanded: state.navigation.expanded,
   loading: state.auth.loading,
})

export default connect(mapStateTopProps, {
   setExpanded,
   setAlert,
   changePassword,
})(ChangePassword)
