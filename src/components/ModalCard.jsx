import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import { Hostname } from '../config';
import axios from 'axios';
import Swal from 'sweetalert2';

// คอมโพเนนต์ ModalCard สำหรับแสดงรายละเอียดของคาเฟ่ในรูปแบบ Modal
const ModalCard = ({ show, handleClose, cafe, isLoggedIn, user }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    if (show) {
      fetchComments();
    }
  }, [show, cafe.cafeID]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${Hostname}/api/getComments.php?cafeID=${cafe.cafeID}`);
      const data = await response.json();
      if (data.status === 'success') {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const data = new FormData();
      data.append("userID", user.userID);
      data.append("cafeID", cafe.cafeID);
      data.append("details", comment);
      if (replyTo) {
        data.append("parentID", replyTo);
      }
      const response = await axios.post(`${Hostname}/api/addComment.php`, data);
      
      if (response.data.status === 'success') {
        setComment('');
        setReplyTo(null);
        // ดึงข้อมูลความคิดเห็นทั้งหมดใหม่หลังจากเพิ่มความคิดเห็น
        await fetchComments();
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const renderComments = (parentID = null) => {
    return comments
      .filter(c => c.parentID === parentID)
      .map(comment => (
        <ListGroup.Item key={comment.commentID}>
          <strong>{comment.username}:</strong> {comment.comment}
          <small className="text-muted ml-2">
            {new Date(comment.createdAt).toLocaleString()}
          </small>
          <Button 
            variant="link" 
            size="sm" 
            onClick={() => setReplyTo(comment.commentID)}
          >
            Reply
          </Button>
          <ListGroup className="mt-2">
            {renderComments(comment.commentID)}
          </ListGroup>
        </ListGroup.Item>
      ));
  };

  return (
    <Modal show={show} onHide={handleClose}>
      {/* ส่วนหัวของ Modal */}
      <Modal.Header closeButton>
        <Modal.Title>{cafe.cafeName}</Modal.Title>
      </Modal.Header>
      {/* เนื้อหาของ Modal */}
      <Modal.Body>
        {/* แสดงรูปภาพของคาเฟ่ */}
        <div className="d-flex justify-content-center mb-3">
          <img src={cafe.img} alt={cafe.cafeName} className="img-fluid" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        </div>
        {/* แสดงข้อมูลของคาเฟ่ */}
        <p><strong>เขต:</strong> {cafe.countyName}</p>
        <p><strong>เวลาเปิด-ปิด:</strong> {cafe.openingHours}</p>
        <p><strong>รายละเอียด:</strong> {cafe.detailsCafe}</p>

        {/* ส่วนแสดงความคิดเห็น */}
        <h5>ความคิดเห็น</h5>
        {/* TODO: Implement comment display logic */}
        <ListGroup>
          {renderComments()}
        </ListGroup>
        {comments.length > 0 && (
          <div className="mt-3">
            {comments.map((comment, index) => (
              <div key={index} className="mb-2 d-flex justify-content-between align-items-center">
                <div>
                  <strong>{comment.username}</strong>: {comment.details}
                </div>
               
              </div>
            ))}
          </div>
        )}

        {/* ฟอร์มสำหรับเพิ่มความคิดเห็น */}
        {isLoggedIn && (
          <Form onSubmit={handleCommentSubmit} className="mt-3">
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={replyTo ? "ตอบกลับความคิดเห็น..." : "เพิ่มความคิดเห็นของคุณ..."}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={() => {
              if (comment.trim() === '') {
                Swal.fire({
                  icon: 'warning',
                  title: 'คำเตือน',
                  text: 'กรุณากรอกความคิดเห็นก่อนส่ง',
                });
                return;
              }
            }}>
              {replyTo ? "ตอบกลับ" : "ส่งความคิดเห็น"}
            </Button>
            {replyTo && (
              <Button variant="secondary" className="ml-2" onClick={() => setReplyTo(null)}>
                ยกเลิกการตอบกลับ
              </Button>
            )}
          </Form>
        )}
      </Modal.Body>
      {/* ส่วนท้ายของ Modal */}
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          ปิด
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCard;