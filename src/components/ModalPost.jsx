import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/Authcontext';
import { Hostname } from '../config';
import axios from 'axios';

const ModalPost = ({ show, handleClose }) => {
  const [cafeName, setCafeName] = useState('');
  const [detailsCafe, setDetailsCafe] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [img, setImg] = useState(null);
  const [countyID, setCountyID] = useState('');
  const [counties, setCounties] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, isLoggedIn } = useContext(AuthContext);

  // Fetch counties when the modal is opened
  useEffect(() => {
    if (show) {
      fetchCounties();
    }
  }, [show]);

  const fetchCounties = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${Hostname}/api/post.php?action=getCounties`);
      if (response.data.status === 'success' && Array.isArray(response.data.data)) {
        setCounties(response.data.data);
      } else {
        setError('ไม่สามารถโหลดข้อมูลเขตได้');
      }
    } catch (error) {
      setError('ไม่สามารถโหลดข้อมูลเขตได้');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isLoggedIn) {
      setError('กรุณาเข้าสู่ระบบก่อนทำการโพสต์');
      return;
    }

    if (!cafeName || !detailsCafe || !openingHours || !countyID) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('action', 'addCafe');
    formData.append('cafeName', cafeName);
    formData.append('detailsCafe', detailsCafe);
    formData.append('openingHours', openingHours);
    formData.append('countyID', countyID);
    formData.append('userID', user.userID);
    if (img) formData.append('img', img);

    try {
      const response = await axios.post(`${Hostname}/api/post.php`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      if (response.data.status === 'success') {
        handleClose();
        resetForm();
      } else {
        setError('เกิดข้อผิดพลาดในการส่งข้อมูล');
      }
    } catch (error) {
      setError('ไม่สามารถส่งข้อมูลได้');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCafeName('');
    setDetailsCafe('');
    setOpeningHours('');
    setImg(null);
    setCountyID('');
    setError(null);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>เพิ่มร้านกาแฟ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="cafeName">
            <Form.Label>ชื่อร้านกาแฟ</Form.Label>
            <Form.Control
              type="text"
              placeholder="กรอกชื่อร้านกาแฟ"
              value={cafeName}
              onChange={(e) => setCafeName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="detailsCafe">
            <Form.Label>รายละเอียด</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="กรอกรายละเอียดร้านกาแฟ"
              value={detailsCafe}
              onChange={(e) => setDetailsCafe(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="openingHours">
            <Form.Label>เวลาเปิด-ปิด</Form.Label>
            <Form.Control
              type="text"
              placeholder="กรอกเวลาเปิด-ปิด"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="img">
            <Form.Label>รูปภาพ</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImg(e.target.files[0])}
              accept="image/*"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="countyID">
            <Form.Label>เขต</Form.Label>
            {isLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <Form.Select
                value={countyID}
                onChange={(e) => setCountyID(e.target.value)}
                required
              >
                <option value="">เลือกเขต</option>
                {counties.map((county) => (
                  <option key={county.countyID} value={county.countyID}>
                    {county.countyName}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'กำลังส่ง...' : 'เพิ่มร้านกาแฟ'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalPost;
