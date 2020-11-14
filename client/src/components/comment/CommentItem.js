import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { connect } from 'react-redux'
import { deleteComment } from '../../store/actions/topics'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

const CommentItem = ({
   comment: { _id, text, name, user, date },
   topicId,
   topicUserId,
   auth,
   deleteComment,
}) => {
   const [showModal, setShowModal] = useState(false)

   const handleClose = () => setShowModal(false)
   const handleShow = () => setShowModal(true)

   const deleteMyComment = (_id) => {
      deleteComment(topicId, _id)
      handleClose()
   }

   return (
      <Fragment>
         {auth.user !== null && (
            <Container>
               <Row className='d-flex flex-colums align-items-center justify-content-center'>
                  <Col className='mt-3'>
                     <blockquote className='blockquote'>
                        {text.map((t, i) => (
                           <p
                              key={i}
                              className='text-justify lead mb-3 CommentItem__text'
                              style={{ lineHeight: 'normal' }}
                           >
                              {t}
                           </p>
                        ))}
                        {user !== auth.user._id ? (
                           <footer className='blockquote-footer text-right mt-3'>
                              <Link
                                 to={`/profile/${user}`}
                                 className='mr-0 CommentItem__link'
                              >
                                 {name}
                                 <cite>
                                    {', '}
                                    Commented on{' '}
                                    <Moment format='DD/MM/YYYY HH:mm'>
                                       {date}
                                    </Moment>
                                 </cite>
                              </Link>
                              {(user === auth.user._id ||
                                 topicUserId === auth.user._id) && (
                                 <i
                                    className='fas fa-trash ml-1 text-primary CommentItem__trash'
                                    onClick={handleShow}
                                 />
                              )}
                           </footer>
                        ) : (
                           <footer className='blockquote-footer text-right mt-3'>
                              {name}
                              <cite>
                                 {', '}
                                 Commented on{' '}
                                 <Moment format='DD/MM/YYYY HH:mm'>
                                    {date}
                                 </Moment>
                              </cite>
                              &nbsp;
                              {(user === auth.user._id ||
                                 topicUserId === auth.user._id) && (
                                 <i
                                    className='fas fa-trash ml-1 text-primary CommentItem__trash'
                                    onClick={handleShow}
                                 />
                              )}
                           </footer>
                        )}
                     </blockquote>
                  </Col>
               </Row>
               <hr className='mt-1' />

               <Modal show={showModal} onHide={handleClose} className='Modal'>
                  <Modal.Header closeButton>
                     <Modal.Title className='text-center text-primary'>
                        DELETE COMMENT
                     </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Are You Sure?</Modal.Body>
                  <Modal.Footer>
                     <Button variant='outline-primary' onClick={handleClose}>
                        Close
                     </Button>
                     <Button
                        variant='primary'
                        onClick={(e) => deleteMyComment(_id)}
                     >
                        Delete
                     </Button>
                  </Modal.Footer>
               </Modal>
            </Container>
         )}
      </Fragment>
   )
}

CommentItem.propTypes = {
   auth: PropTypes.object.isRequired,
   comment: PropTypes.object.isRequired,
   deleteComment: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
   auth: state.auth,
})

export default connect(mapStateToProps, { deleteComment })(CommentItem)
