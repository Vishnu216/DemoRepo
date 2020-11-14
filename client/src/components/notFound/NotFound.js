import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const NotFound = () => {
   return (
      <Container>
         <Row className='NotFound__row'>
            <Col>
               <h2 className='text-primary'>404 Page Not Found</h2>
            </Col>
         </Row>
      </Container>
   )
}

export default NotFound
