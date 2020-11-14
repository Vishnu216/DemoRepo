import React from 'react'
import Spinnerr from 'react-bootstrap/Spinner'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Spinner = () => (
   <Container className='Spinner d-flex flex-column justify-content-center align-items-center'>
      <Row>
         <Col>
            <Spinnerr animation='border' role='status'>
               <span className='sr-only'>Loading...</span>
            </Spinnerr>
         </Col>
      </Row>
   </Container>
)
export default Spinner
