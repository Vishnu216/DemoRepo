import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { setExpanded } from '../../store/actions/navigation'
import {
   resendVerificationEmail,
   deleteAccount,
} from '../../store/actions/auth'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Spinner from '../spinner/Spinner'

const Settings = ({
   loading,
   expanded,
   setExpanded,
   user,
   resendVerificationEmail,
   deleteAccount,
}) => {
   const history = useHistory()
   const [showModal, setShowModal] = useState(false)

   const handleClose = () => setShowModal(false)
   const handleShow = () => setShowModal(true)

   const deleteMyAccount = () => {
      handleClose()
      deleteAccount(history)
   }

   return (
      <Fragment>
         {loading || !user ? (
            <Spinner />
         ) : (
            <Container
               onClick={() => {
                  if (expanded) {
                     setExpanded(false)
                  }
               }}
            >
               <Row className='Settings__row text-primary mb-3'>
                  <Col>
                     <h2 className='text-center font-weight-bold'>SETTINGS</h2>
                     <hr className='mt-1' />
                  </Col>
               </Row>
               <Row className='mb-3'>
                  <Col>
                     <Link to='/changepassword' className='btn btn-primary'>
                        <i className='fas fa-key' /> Change Password
                     </Link>
                  </Col>
               </Row>
               {!user.verified && (
                  <Row className='mb-3'>
                     <Col>
                        <Button
                           variant='primary'
                           onClick={(e) => resendVerificationEmail(user.email)}
                        >
                           <i className='fas fa-envelope'></i> Resend
                           verification email
                        </Button>
                     </Col>
                  </Row>
               )}
               <Row>
                  <Col>
                     <Button variant='primary' onClick={handleShow}>
                        <i className='fas fa-trash' /> Delete Account
                     </Button>
                  </Col>
               </Row>
               <Modal show={showModal} onHide={handleClose} className='Modal'>
                  <Modal.Header closeButton>
                     <Modal.Title className='text-center text-primary'>
                        DELETE ACCOUNT
                     </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     <p>
                        Are You Sure? Your profile, topics and comments will be
                        deleted!
                     </p>
                  </Modal.Body>
                  <Modal.Footer>
                     <Button variant='outline-primary' onClick={handleClose}>
                        Close
                     </Button>
                     <Button variant='primary' onClick={deleteMyAccount}>
                        Delete
                     </Button>
                  </Modal.Footer>
               </Modal>
            </Container>
         )}
      </Fragment>
   )
}

Settings.propTypes = {
   loading: PropTypes.bool.isRequired,
   setExpanded: PropTypes.func.isRequired,
   resendVerificationEmail: PropTypes.func.isRequired,
   user: PropTypes.object,
   deleteAccount: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
   loading: state.auth.loading,
   expanded: state.navigation.expanded,
   user: state.auth.user,
})

export default connect(mapStateToProps, {
   setExpanded,
   resendVerificationEmail,
   deleteAccount,
})(Settings)
