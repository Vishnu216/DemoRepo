import React, { useState, useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { updateProfile, getMyProfile } from '../../store/actions/profile'
import { setAlert } from '../../store/actions/alert'
import { setExpanded } from '../../store/actions/navigation'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from '../spinner/Spinner'

const UpdateProfile = ({
   getMyProfile,
   setAlert,
   loading,
   profile,
   setExpanded,
   expanded,
   updateProfile,
   user,
}) => {
   const [formData, setFormData] = useState({
      bio: '',
      status: '',
      location: '',
   })

   const [image, setImage] = useState('')
   const [displayNone, setDisplayNone] = useState('')

   const { bio, status, location } = formData

   useEffect(() => {
      getMyProfile()
      setFormData({
         bio: !profile ? '' : profile.bio,
         status: !profile ? '' : profile.status,
         location: !profile ? '' : profile.location,
      })
   }, [
      getMyProfile,
      profile && profile.bio,
      profile && profile.status,
      profile && profile.location,
   ])

   const history = useHistory()

   const onChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
   }

   const onChangeImage = (e) => {
      let patt = /[\/.](jpg|jpeg|png)$/i
      if (e.target.files[0]) {
         if (!patt.test(e.target.files[0].name)) {
            return setAlert('Please choose a valid file!', 'danger')
         }

         let sizeInMB = (e.target.files[0].size / (1024 * 1024)).toFixed(2)

         if (sizeInMB > 2) {
            return setAlert('Maximum size exceeded!', 'danger')
         }
         setImage(e.target.files[0])
         setDisplayNone('d-none')
      }
   }

   const onSubmit = (e) => {
      e.preventDefault()

      if (!bio && !status && !location && !image) {
         return setAlert('All the fields cannot be empty!', 'danger')
      }

      if (!user.verified) {
         return setAlert(
            'Please verify your email to update profile!',
            'danger'
         )
      }
      updateProfile(formData, image, history)
   }

   return (
      <Fragment>
         {loading || !profile || !user ? (
            <Spinner />
         ) : (
            <Container
               className='UpdateProfile d-flex flex-column'
               onClick={() => {
                  if (expanded) {
                     setExpanded(false)
                  }
               }}
            >
               <Row className='UpdateProfile__row d-flex flex-column align-items-center'>
                  <Col>
                     <h2 className='text-center text-primary font-weight-bold'>
                        PROFILE
                     </h2>
                     <hr className='mt-1 mb-5' />
                     <Form onSubmit={(e) => onSubmit(e)}>
                        <Form.Group>
                           <Form.Control
                              className='UpdateProfile__name'
                              type='text'
                              value={profile.user.name}
                              readOnly
                           />
                        </Form.Group>
                        <Form.Group>
                           <Form.File
                              id='custom-file-translate-scss'
                              label={
                                 image
                                    ? image.name
                                    : 'Choose your profile image'
                              }
                              lang='en'
                              custom
                              onChange={onChangeImage}
                           />
                           <small
                              className={`form-text text-muted ml-2 ${displayNone}`}
                           >
                              Only jpeg and png files are allowed. Max size 2MB!
                           </small>
                        </Form.Group>
                        <Form.Group>
                           <Form.Control
                              as='textarea'
                              placeholder='Enter your bio'
                              name='bio'
                              value={bio}
                              onChange={(e) => onChange(e)}
                           />
                        </Form.Group>
                        <Form.Group>
                           <Form.Control
                              type='text'
                              placeholder='Enter your status'
                              name='status'
                              value={status}
                              onChange={(e) => onChange(e)}
                           />
                        </Form.Group>
                        <Form.Group>
                           <Form.Control
                              type='text'
                              placeholder='Enter your location'
                              name='location'
                              value={location}
                              onChange={(e) => onChange(e)}
                           />
                        </Form.Group>
                        <Button
                           type='submit'
                           variant='primary'
                           block
                           className='mb-4'
                        >
                           Update Profile
                        </Button>
                     </Form>
                  </Col>
               </Row>
            </Container>
         )}
      </Fragment>
   )
}

UpdateProfile.propTypes = {
   getMyProfile: PropTypes.func.isRequired,
   profile: PropTypes.object,
   loading: PropTypes.bool.isRequired,
   setExpanded: PropTypes.func.isRequired,
   user: PropTypes.object,
   setAlert: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
   profile: state.profile.profile,
   loading: state.profile.loading,
   expanded: state.navigation.expanded,
   user: state.auth.user,
})

export default connect(mapStateToProps, {
   updateProfile,
   getMyProfile,
   setAlert,
   setExpanded,
})(UpdateProfile)
