import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { NavLink, Link, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../store/actions/auth'
import { setExpanded } from '../../store/actions/navigation'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const Navigation = ({ isAuthenticated, expanded, logout, setExpanded }) => {
   const [showModal, setShowModal] = useState(false)
   const history = useHistory()

   const logoutHandler = () => {
      handleClose()
      logout(history)
   }

   const handleClose = () => setShowModal(false)
   const handleShow = () => setShowModal(true)

   const guestLinks = (
      <Fragment>
         {/* <NavLink className='px-3 mx-1' exact to='/' activeClassName='active'>
            <i className='fas fa-home' /> HOME
         </NavLink> */}
         <NavLink className='px-3 mx-1' to='/login' activeClassName='active'>
            <i className='fas fa-sign-in-alt' /> LOGIN
         </NavLink>
         <NavLink className='px-3 mx-1' to='/register' activeClassName='active'>
            <i className='fas fa-user-plus' /> REGISTER
         </NavLink>
      </Fragment>
   )

   const authLinks = (
      <Fragment>
         {/* <NavLink className='px-3 mx-1' to='/topics' activeClassName='active'>
            <i className='fas fa-pencil-alt' /> TOPICS
         </NavLink> */}
         <NavLink className='px-3 mx-1' to='/profile' activeClassName='active'>
            <i className='fas fa-id-card' /> PROFILE
         </NavLink>
         <NavLink className='px-3 mx-1' to='/settings' activeClassName='active'>
            <i className='fas fa-cog' /> SETTINGS
         </NavLink>
         <Link className='px-3 mx-1' to='#' onClick={handleShow}>
            <i className='fas fa-sign-out-alt' /> LOGOUT
         </Link>
      </Fragment>
   )

   return (
      <Fragment>
         <Navbar
            bg='dark'
            variant='dark'
            expand='md'
            fixed='top'
            className='Navigation'
            expanded={expanded}
         >
            <Link
               to={isAuthenticated ? '/topics' : '/'}
               className='font-weight-bold Navigation__brand'
               onClick={() => {
                  if (expanded) {
                     setExpanded(false)
                  }
               }}
            >
               WRITIVE
            </Link>
            <Navbar.Toggle
               aria-controls='basic-navbar-nav'
               onClick={() => setExpanded(expanded ? false : 'expanded')}
            />
            <Navbar.Collapse id='basic-navbar-nav'>
               <Nav
                  className='ml-auto nav'
                  onClick={() => {
                     if (expanded) {
                        setExpanded(false)
                     }
                  }}
               >
                  {isAuthenticated !== false ? authLinks : guestLinks}
               </Nav>
            </Navbar.Collapse>
         </Navbar>
         <Modal show={showModal} onHide={handleClose} className='Modal'>
            <Modal.Header closeButton>
               <Modal.Title>Logout</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are You Sure?</Modal.Body>
            <Modal.Footer>
               <Button variant='outline-primary' onClick={handleClose}>
                  Close
               </Button>
               <Button variant='primary' onClick={logoutHandler}>
                  Logout
               </Button>
            </Modal.Footer>
         </Modal>
      </Fragment>
   )
}

Navigation.propTypes = {
   isAuthenticated: PropTypes.bool.isRequired,
   logout: PropTypes.func.isRequired,
   setExpanded: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
   isAuthenticated: state.auth.isAuthenticated,
   expanded: state.navigation.expanded,
})

export default connect(mapStateToProps, { logout, setExpanded })(Navigation)
