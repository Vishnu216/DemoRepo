import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { verifyMail } from '../../store/actions/auth'
import Spinner from '../spinner/Spinner'

const VerifyEmail = ({ verifyMail, loading }) => {
   const history = useHistory()
   const { token } = useParams()
   useEffect(() => {
      verifyMail(token, history)
   }, [])
   return <Fragment>{loading && <Spinner />}</Fragment>
}

VerifyEmail.propTypes = {
   verifyMail: PropTypes.func.isRequired,
   loading: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
   loading: state.auth.loading,
})

export default connect(mapStateToProps, { verifyMail })(VerifyEmail)
