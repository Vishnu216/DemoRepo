import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { setExpanded } from '../../store/actions/navigation'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Home = ({ setExpanded, expanded, isAuthenticated }) => {
   if (isAuthenticated) {
      return <Redirect to='/topics' />
   }

   return (
      <div
         className='Home'
         onClick={() => {
            if (expanded) {
               setExpanded(false)
            }
         }}
      >
         <div className='Home__dark_overlay'>
            <Container className='Home__section  d-flex flex-column justify-content-center align-items-center'>
               <Row className='my-3'>
                  <Col className=' text-center text-white'>
                     <h1 className='display-3 my-3 font-weight-bold Home__heading'>
                        WRITIVE
                     </h1>
                     <p className='lead font-italic'>
                        Have anything to discuss?
                     </p>
                  </Col>
               </Row>
               <Row>
                  <Col>
                     <Link
                        to='/register'
                        className='btn btn-primary mr-3'
                        onClick={() => {
                           if (expanded) {
                              setExpanded(false)
                           }
                        }}
                     >
                        Register
                     </Link>
                     <Link
                        to='/login'
                        className='btn btn-primary'
                        onClick={() => {
                           if (expanded) {
                              setExpanded(false)
                           }
                        }}
                     >
                        Login
                     </Link>
                  </Col>
               </Row>
            </Container>
         </div>
      </div>
   )
}

Home.propTypes = {
   isAuthenticated: PropTypes.bool.isRequired,
   setExpanded: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
   isAuthenticated: state.auth.isAuthenticated,
   expanded: state.navigation.expanded,
})

export default connect(mapStateToProps, { setExpanded })(Home)
