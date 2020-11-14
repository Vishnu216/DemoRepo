import React, { useEffect, Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { getTopic } from '../../store/actions/topics'
import { addComment } from '../../store/actions/topics'
import { setExpanded } from '../../store/actions/navigation'
import Moment from 'react-moment'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import CommentItem from '../comment/CommentItem'
import Spinner from '../spinner/Spinner'
import Modal from 'react-bootstrap/Modal'
import {
   Container as FloatingContainer,
   Button as FloatingButton,
} from 'react-floating-action-button'
import { animateScroll as scroll } from 'react-scroll'

const Topic = ({
   topics: { topic, loading },
   auth,
   getTopic,
   addComment,
   match,
   setExpanded,
   expanded,
}) => {
   const history = useHistory()
   useEffect(() => {
      getTopic(match.params.id, history)
      window.addEventListener('scroll', checkScrollTop)

      return () => {
         window.removeEventListener('scroll', checkScrollTop)
      }
   }, [getTopic, match.params.id])

   const [showScroll, setShowScroll] = useState('d-none')

   const [showModal, setShowModal] = useState(false)

   const handleClose = () => setShowModal(false)
   const handleShow = () => setShowModal(true)

   const [formData, setFormData] = useState({
      text: '',
      description: '',
   })

   const [err, setErr] = useState({
      textErr: '',
   })

   const { text } = formData

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
            if (value.length > 0) {
               errors.textErr = ''
            } else {
               errors.textErr = 'Description is required!'
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
            setErr({
               ...err,
               textErr: 'A word cannot have more than 20 characters!',
            })
            return
         }
      }

      if (text === '' || text === undefined) {
         setErr({
            ...err,
            textErr: 'Description is required!',
         })
         return
      }

      if (validateForm(err)) {
         addComment(topic._id, { text })
      }

      handleClose()
   }

   const clearForm = (e) => {
      setErr({ ...err, textErr: '' })
      setFormData({ ...formData, text: '' })
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

   return (
      <Fragment>
         {loading === false && auth.user ? (
            <Fragment>
               {auth.user !== null && topic !== null && (
                  <Container
                     className='Topic'
                     onClick={() => {
                        if (expanded) {
                           setExpanded(false)
                        }
                     }}
                  >
                     <Row className='Topic__row d-flex flex-colums align-items-center text-center'>
                        <Col>
                           <h3 className='text-primary mb-3'>
                              <p
                                 className='text-justify mb-1'
                                 style={{ lineHeight: 'normal' }}
                              >
                                 {topic.text}
                              </p>
                           </h3>

                           <Row className='d-flex flex-colums align-items-center justify-content-center mb-3'>
                              <Col className='mt-3'>
                                 <blockquote className='blockquote'>
                                    {topic.description.map((d, i) => (
                                       <p
                                          key={i}
                                          className='text-justify lead mb-3'
                                          style={{ lineHeight: 'normal' }}
                                       >
                                          {d}
                                       </p>
                                    ))}

                                    {topic.user !== auth.user._id ? (
                                       <footer className='blockquote-footer text-right mt-3'>
                                          <Link
                                             to={`/profile/${topic.user}`}
                                             className='Topic__link'
                                          >
                                             {topic.name}
                                             <cite>
                                                {', '}
                                                Created on{' '}
                                                <Moment format='DD/MM/YYYY HH:mm'>
                                                   {topic.date}
                                                </Moment>
                                             </cite>
                                          </Link>
                                       </footer>
                                    ) : (
                                       <footer className='blockquote-footer text-right mt-3'>
                                          {topic.name}
                                          <cite>
                                             {', '}
                                             Created on{' '}
                                             <Moment format='DD/MM/YYYY HH:mm'>
                                                {topic.date}
                                             </Moment>
                                          </cite>
                                       </footer>
                                    )}
                                 </blockquote>
                              </Col>
                           </Row>
                        </Col>
                     </Row>

                     <Row>
                        <Col>
                           <h4 className='text-primary'>Recent Comments</h4>
                           <hr className='mt-1' />
                           {topic.comments.map((comment) => (
                              <CommentItem
                                 key={comment._id}
                                 comment={comment}
                                 topicId={topic._id}
                                 topicUserId={topic.user}
                              />
                           ))}
                        </Col>
                     </Row>
                     <FloatingContainer>
                        <button
                           tooltip='Create Comment'
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
                              COMMENT
                           </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                           <Form>
                              <Form.Group>
                                 <Form.Control
                                    as='textarea'
                                    placeholder='Description...'
                                    rows='7'
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
                              {!auth.user.verified && (
                                 <span style={{ color: 'red' }}>
                                    Please verify your email to comment!
                                 </span>
                              )}
                           </Form>
                        </Modal.Body>
                        <Modal.Footer>
                           <Button
                              variant='outline-primary'
                              onClick={handleClose}
                           >
                              Close
                           </Button>
                           <Button
                              variant='primary'
                              onClick={onSubmit}
                              disabled={!auth.user.verified}
                           >
                              Comment
                           </Button>
                        </Modal.Footer>
                     </Modal>
                  </Container>
               )}
            </Fragment>
         ) : (
            <Fragment>
               <Spinner />
            </Fragment>
         )}
      </Fragment>
   )
}

Topic.propTypes = {
   topics: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   getTopic: PropTypes.func.isRequired,
   addComment: PropTypes.func.isRequired,
   loading: PropTypes.bool,
   setExpanded: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
   topics: state.topics,
   auth: state.auth,
   expanded: state.navigation.expanded,
})

export default connect(mapStateToProps, { getTopic, addComment, setExpanded })(
   Topic
)
