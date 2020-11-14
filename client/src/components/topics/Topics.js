import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setAlert } from '../../store/actions/alert'
import { getTopics, addTopic } from '../../store/actions/topics'
import { setExpanded } from '../../store/actions/navigation'
import { disableVerificationAlert } from '../../store/actions/auth'
import TopicItem from './TopicItem'
import Spinner from '../spinner/Spinner'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import {
   Container as FloatingContainer,
   Button as FloatingButton,
} from 'react-floating-action-button'
import { animateScroll as scroll } from 'react-scroll'

const Topics = ({
   user,
   verificationAlert,
   disableVerificationAlert,
   setAlert,
   getTopics,
   addTopic,
   topics: { topics, loading },
   expanded,
   setExpanded,
}) => {
   useEffect(() => {
      getTopics()
      if (verificationAlert && user) {
         if (!user.verified) {
            setAlert('Please verify your email!', 'danger')
            disableVerificationAlert()
         }
      }

      window.addEventListener('scroll', checkScrollTop)

      return () => {
         window.removeEventListener('scroll', checkScrollTop)
      }
   }, [verificationAlert, getTopics])

   const [showScroll, setShowScroll] = useState('d-none')
   const [search, setSearch] = useState('')
   const [filter, setFilter] = useState('topic')
   const [showModal, setShowModal] = useState(false)

   const handleClose = () => setShowModal(false)
   const handleShow = () => setShowModal(true)

   const [formData, setFormData] = useState({
      text: '',
      description: '',
   })

   const [err, setErr] = useState({
      textErr: '',
      descriptionErr: '',
   })

   const { text, description } = formData

   const validateForm = (errors) => {
      let valid = true
      Object.values(errors).forEach((val) => val.length > 0 && (valid = false))
      return valid
   }

   const onChange = (e) => {
      let errors = err
      const { name, value } = e.target

      switch (name) {
         case 'text':
            if (value.length > 0 && value.length <= 100) {
               errors.textErr = ''
            } else if (value.length > 100) {
               errors.textErr = 'Maximum character limit exceeded!'
            } else {
               errors.textErr = 'Subject is required!'
            }
            break
         case 'description':
            if (value.length > 0) {
               errors.descriptionErr = ''
            } else {
               errors.descriptionErr = 'Description is required!'
            }
            break
         default:
            break
      }

      setFormData({ ...formData, [e.target.name]: e.target.value })

      setErr({ ...errors, errors })
   }

   const onSubmit = (e) => {
      e.preventDefault()

      for (let word of text.split(/\s+/)) {
         if (word.length > 20) {
            console.log('text split')
            setErr({
               ...err,
               textErr: 'A word cannot have more than 20 characters!',
            })
            return
         }
      }

      for (let word of description.split(/\s+/)) {
         if (word.length > 20) {
            setErr({
               ...err,
               descriptionErr: 'A word cannot have more than 20 characters!',
            })
            return
         }
      }

      if (
         (text === '' || text === undefined) &&
         (description === '' || description === undefined)
      ) {
         setErr({
            ...err,
            textErr: 'Subject is required!',
            descriptionErr: 'Description is required!',
         })
         return
      } else if (text === '' || text === undefined) {
         setErr({
            ...err,
            textErr: 'Subject is required!',
         })
         return
      } else if (description === '' || description === undefined) {
         setErr({
            ...err,
            descriptionErr: 'Description is required!',
         })
         return
      }

      if (validateForm(err)) {
         addTopic({ text, description })
      }

      handleClose()
   }

   const clearForm = (e) => {
      setErr({ ...err, textErr: '', descriptionErr: '' })
      setFormData({ ...formData, text: '', description: '' })
   }

   const callModal = (e) => {
      clearForm()
      handleShow()
   }

   const scrollToTop = () => {
      scroll.scrollToTop()
   }

   const checkScrollTop = () => {
      if (window.pageYOffset > 200) {
         setShowScroll('')
      } else if (window.pageYOffset <= 200) {
         setShowScroll('d-none')
      }
   }

   const onSearchChange = (e) => {
      e.preventDefault()
      setSearch(e.target.value)
   }

   const onFilterChange = (e) => {
      setFilter(e.target.value)
   }

   return (
      <Fragment>
         {loading === false && user ? (
            <Fragment>
               <Container
                  className='Topics'
                  onClick={() => {
                     if (expanded) {
                        setExpanded(false)
                     }
                  }}
               >
                  <Row className='Topics__row d-flex flex-colums align-items-center text-center'>
                     <Col>
                        <h2 className='text-primary font-weight-bold'>
                           TOPICS
                        </h2>
                        <hr className='mt-1 mb-3' />
                     </Col>
                  </Row>
                  <Row>
                     <Col>
                        <Form>
                           <Row>
                              <Col xs={12} sm={6}>
                                 <Form.Group>
                                    <Form.Control
                                       as='select'
                                       onChange={onFilterChange}
                                    >
                                       <option value='topic'>
                                          Search by topic
                                       </option>
                                       <option value='user'>
                                          Search by user
                                       </option>
                                    </Form.Control>
                                 </Form.Group>
                              </Col>
                              <Col xs={12} sm={6}>
                                 <Form.Group>
                                    <Form.Control
                                       placeholder='Search...'
                                       name='search'
                                       value={search}
                                       autoComplete='on'
                                       onChange={onSearchChange}
                                    />
                                 </Form.Group>
                              </Col>
                           </Row>
                        </Form>
                     </Col>
                  </Row>

                  {topics.map((topic) => (
                     <TopicItem
                        key={topic._id}
                        topic={topic}
                        search={search}
                        filter={filter}
                     />
                  ))}

                  <FloatingContainer>
                     <button
                        tooltip='Create Topic'
                        className='fab-item text-white bg-primary'
                        onClick={callModal}
                     >
                        <i className='fa fa-plus'></i>
                     </button>
                     <button
                        tooltip='Scroll to top'
                        className={`fab-item text-white bg-primary ${showScroll}`}
                        onClick={scrollToTop}
                     >
                        <i className='fas fa-arrow-up'></i>
                     </button>
                     <FloatingButton
                        rotate={true}
                        icon='fas fa-bars'
                        className='fab-item text-white bg-primary'
                     />
                  </FloatingContainer>

                  <Modal
                     show={showModal}
                     onHide={handleClose}
                     className='Modal'
                  >
                     <Modal.Header closeButton>
                        <Modal.Title className='text-primary font-weight-bold'>
                           TOPIC
                        </Modal.Title>
                     </Modal.Header>
                     <Modal.Body>
                        <Form>
                           <Form.Group>
                              <Form.Control
                                 as='textarea'
                                 placeholder='Subject...'
                                 name='text'
                                 value={text}
                                 onChange={onChange}
                              />
                              {err.textErr.length > 0 && (
                                 <span style={{ color: 'red' }}>
                                    {err.textErr}
                                 </span>
                              )}
                           </Form.Group>
                           <Form.Group>
                              <Form.Control
                                 as='textarea'
                                 placeholder='Description...'
                                 rows='7'
                                 name='description'
                                 value={description}
                                 onChange={onChange}
                              />
                              {err.descriptionErr.length > 0 && (
                                 <span style={{ color: 'red' }}>
                                    {err.descriptionErr}
                                 </span>
                              )}
                           </Form.Group>
                           {!user.verified && (
                              <span style={{ color: 'red' }}>
                                 Please verify your email to create topic!
                              </span>
                           )}
                        </Form>
                     </Modal.Body>
                     <Modal.Footer>
                        <Button variant='outline-primary' onClick={handleClose}>
                           Close
                        </Button>
                        <Button
                           variant='primary'
                           onClick={onSubmit}
                           disabled={!user.verified}
                        >
                           Create
                        </Button>
                     </Modal.Footer>
                  </Modal>
               </Container>
            </Fragment>
         ) : (
            <Spinner />
         )}
      </Fragment>
   )
}

Topics.propTypes = {
   user: PropTypes.object,
   verificationAlert: PropTypes.bool.isRequired,
   setAlert: PropTypes.func.isRequired,
   topics: PropTypes.object.isRequired,
   getTopics: PropTypes.func.isRequired,
   loading: PropTypes.bool,
   addTopic: PropTypes.func.isRequired,
   setExpanded: PropTypes.func.isRequired,
   disableVerificationAlert: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
   user: state.auth.user,
   verificationAlert: state.auth.verificationAlert,
   topics: state.topics,
   expanded: state.navigation.expanded,
})

export default connect(mapStateToProps, {
   setAlert,
   getTopics,
   addTopic,
   setExpanded,
   disableVerificationAlert,
})(Topics)
