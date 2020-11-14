import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { setAlert } from '../../store/actions/alert'
import { setExpanded } from '../../store/actions/navigation'
import { forgotPasswordLink } from '../../store/actions/auth'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from '../spinner/Spinner'

const ForgotPasswordLink = ({
   setExpanded,
   expanded,
   setAlert,
   loading,
   forgotPasswordLink,
}) => {
   const history = useHistory()

   const [formData, setFormData] = useState({
      email: '',
   })

   const [err, setErr] = useState({
      emailErr: '',
   })

   const { email } = formData

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
         default:
            break
      }
      setFormData({ ...formData, [name]: value })

      setErr({ ...errors, errors })
   }

   const onSubmit = (e) => {
      e.preventDefault()

      if (email === '') {
         setAlert('Email cannot be empty!', 'danger')
         return
      }
      if (validateForm(err)) {
         forgotPasswordLink({ email }, history)
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
               className='ForgotPasswordLink d-flex flex-column justify-content-center align-items-center'
               onClick={() => {
                  if (expanded) {
                     setExpanded(false)
                  }
               }}
            >
               <Row className='ForgotPasswordLink__row'>
                  <Col>
                     <Card className='ForgotPasswordLink__card--width'>
                        <Card.Header className='text-center text-primary ForgotPasswordLink__header--size'>
                           FORGOT PASSWORD
                        </Card.Header>
                        <Card.Body>
                           <Form onSubmit={(e) => onSubmit(e)}>
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
                              <Button type='submit' variant='primary' block>
                                 Send Link
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

ForgotPasswordLink.propTypes = {
   setExpanded: PropTypes.func.isRequired,
   loading: PropTypes.bool.isRequired,
   setAlert: PropTypes.func.isRequired,
}

const mapStateTopProps = (state) => ({
   expanded: state.navigation.expanded,
   loading: state.auth.loading,
})

export default connect(mapStateTopProps, {
   setExpanded,
   setAlert,
   forgotPasswordLink,
})(ForgotPasswordLink)
