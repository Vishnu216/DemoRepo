import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { connect } from 'react-redux'
import { deleteTopic } from '../../store/actions/topics'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

const TopicItem = ({
   topic: { _id, text, name, user, date },
   auth,
   deleteTopic,
   search,
   filter,
}) => {
   const [showModal, setShowModal] = useState(false)

   const handleClose = () => setShowModal(false)
   const handleShow = () => setShowModal(true)

   const deleteMyTopic = (_id) => {
      deleteTopic(_id)
      handleClose()
   }

   return (
      <Fragment>
         {auth.user !== null && (
            <Container>
               <Fragment>
                  {filter === 'topic' ? (
                     <Fragment>
                        {text.toLowerCase().includes(search.toLowerCase()) && (
                           <Row className='d-flex flex-colums align-items-center justify-content-center mt-2'>
                              <Col className='mt-3'>
                                 <Fragment>
                                    <blockquote className='blockquote'>
                                       <p
                                          className='text-justify lead mb-2'
                                          style={{ lineHeight: 'normal' }}
                                       >
                                          <Link
                                             to={`topics/${_id}`}
                                             className='TopicItem__link'
                                          >
                                             {text}
                                          </Link>
                                       </p>

                                       {user !== auth.user._id ? (
                                          <footer className='blockquote-footer text-right'>
                                             <Link
                                                to={`/profile/${user}`}
                                                className='p-0 TopicItem__link'
                                             >
                                                {name}
                                                <cite className='mr-1'>
                                                   {', '}
                                                   Created on{' '}
                                                   <Moment format='DD/MM/YYYY HH:mm'>
                                                      {date}
                                                   </Moment>
                                                </cite>
                                             </Link>
                                          </footer>
                                       ) : (
                                          <footer className='blockquote-footer text-right'>
                                             {name}
                                             <cite>
                                                {', '}
                                                Created on{' '}
                                                <Moment format='DD/MM/YYYY HH:mm'>
                                                   {date}
                                                </Moment>
                                             </cite>
                                             &nbsp;
                                             {user === auth.user._id && (
                                                <Fragment>
                                                   <i
                                                      className='fas fa-trash ml-1 text-primary TopicItem__trash'
                                                      onClick={handleShow}
                                                   />
                                                </Fragment>
                                             )}
                                          </footer>
                                       )}
                                    </blockquote>
                                    <hr className='mt-0' />
                                 </Fragment>
                              </Col>
                           </Row>
                        )}
                     </Fragment>
                  ) : (
                     <Fragment>
                        {name.toLowerCase().includes(search.toLowerCase()) && (
                           <Row className='d-flex flex-colums align-items-center justify-content-center mt-2'>
                              <Col className='mt-3'>
                                 <Fragment>
                                    <blockquote className='blockquote'>
                                       <p
                                          className='TopicItem__text text-justify lead mb-2'
                                          style={{ lineHeight: 'normal' }}
                                       >
                                          <Link
                                             to={`topics/${_id}`}
                                             className='TopicItem__link'
                                          >
                                             {text}
                                          </Link>
                                       </p>

                                       {user !== auth.user._id ? (
                                          <footer className='blockquote-footer text-right'>
                                             <Link
                                                to={`/profile/${user}`}
                                                className='p-0'
                                             >
                                                {name}
                                                <cite className='mr-1'>
                                                   {', '}
                                                   Created on{' '}
                                                   <Moment format='DD/MM/YYYY HH:mm'>
                                                      {date}
                                                   </Moment>
                                                </cite>
                                             </Link>
                                          </footer>
                                       ) : (
                                          <footer className='blockquote-footer text-right'>
                                             {name}
                                             <cite>
                                                {', '}
                                                Created on{' '}
                                                <Moment format='DD/MM/YYYY HH:mm'>
                                                   {date}
                                                </Moment>
                                             </cite>
                                             &nbsp;
                                             {user === auth.user._id && (
                                                <Fragment>
                                                   <i
                                                      className='fas fa-trash ml-1 text-primary TopicItem__trash'
                                                      onClick={handleShow}
                                                   />
                                                </Fragment>
                                             )}
                                          </footer>
                                       )}
                                    </blockquote>
                                    <hr className='mt-0' />
                                 </Fragment>
                              </Col>
                           </Row>
                        )}{' '}
                     </Fragment>
                  )}

                  <Modal
                     show={showModal}
                     onHide={handleClose}
                     className='Modal'
                  >
                     <Modal.Header closeButton>
                        <Modal.Title className='text-center text-primary'>
                           DELETE TOPIC
                        </Modal.Title>
                     </Modal.Header>
                     <Modal.Body>Are You Sure?</Modal.Body>
                     <Modal.Footer>
                        <Button variant='outline-primary' onClick={handleClose}>
                           Close
                        </Button>
                        <Button
                           variant='primary'
                           onClick={(e) => deleteMyTopic(_id)}
                        >
                           Delete
                        </Button>
                     </Modal.Footer>
                  </Modal>
               </Fragment>
            </Container>
         )}
      </Fragment>
   )
}

TopicItem.propTypes = {
   auth: PropTypes.object.isRequired,
   topic: PropTypes.object.isRequired,
   deleteTopic: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
   auth: state.auth,
})

export default connect(mapStateToProps, { deleteTopic })(TopicItem)
