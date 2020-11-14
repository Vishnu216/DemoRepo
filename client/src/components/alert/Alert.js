import React from 'react'
import PropTypes from 'prop-types'
import Alertt from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { connect } from 'react-redux'

const Alert = ({ alerts }) =>
   alerts !== null &&
   alerts.length > 0 &&
   alerts.map((alert) => (
      <Container key={alert.id}>
         <Row>
            <Col>
               <Alertt variant={alert.alertType} className='Alert__margin'>
                  {alert.msg}
               </Alertt>
            </Col>
         </Row>
      </Container>
   ))

Alert.propTypes = {
   alerts: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => ({
   alerts: state.alert,
})

export default connect(mapStateToProps)(Alert)
