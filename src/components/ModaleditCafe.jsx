import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Hostname } from '../config';
import Swal from 'sweetalert2';

function ModaleditCafe({ show, handleClose, cafe, updateCafe }) {
  const [editedCafe, setEditedCafe] = useState(cafe);
  const [counties, setCounties] = useState([]);

  useEffect(() => {
    setEditedCafe(cafe);
    fetchCounties();
  }, [cafe]);

  const fetchCounties = async () => {
    try {
      const response = await fetch(`${Hostname}/api/countiesCafe.php`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCounties(data);
    } catch (error) {
      console.error('Error fetching counties:', error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCafe(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("cafeName", editedCafe.cafeName);
    formData.append("openingHours", editedCafe.openingHours);
    formData.append("detailsCafe", editedCafe.detailsCafe);
    formData.append("countyID", editedCafe.countyID);
    formData.append("cafeID", editedCafe.cafeID);

    if (editedCafe.newImage) {
      formData.append("img", editedCafe.newImage);
    }

    const requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    };

    try {
      const response = await fetch(`${Hostname}/api/editcafe.php`, requestOptions);
      const result = await response.text();
      console.log(result);
      
      const resultObj = JSON.parse(result);
      if (resultObj.status === 'success') {
        console.log('Cafe updated successfully');
        Swal.fire({
          icon: 'success',
          title: 'แก้ไขสำเร็จ',
          text: 'ข้อมูลคาเฟ่ถูกอัปเดตเรียบร้อยแล้ว',
        });
        handleClose();
      } else {
        console.error('Failed to update cafe:', resultObj.message);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถอัปเดตข้อมูลคาเฟ่ได้',
        });
      }
    } catch (error) {
      console.error('Error updating cafe:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์',
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>แก้ไขข้อมูลคาเฟ่</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>ชื่อคาเฟ่</Form.Label>
            <Form.Control
              type="text"
              name="cafeName"
              value={editedCafe?.cafeName || ''}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>รายละเอียด</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="detailsCafe"
              value={editedCafe?.detailsCafe || ''}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>เวลาเปิด-ปิด</Form.Label>
            <Form.Control
              type="text"
              name="openingHours"
              value={editedCafe?.openingHours || ''}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>เขต</Form.Label>
            <Form.Select
              name="countyID"
              value={editedCafe?.countyID || ''}
              onChange={handleChange}
              required
            >
              <option value="">เลือกเขต</option>
              {counties && counties.map((county) => (
                <option key={county.countyID} value={county.countyID}>
                  {county.countyName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>รูปภาพคาเฟ่</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setEditedCafe(prev => ({
                    ...prev,
                    newImage: file
                  }));
                }
              }}
            />
            {(editedCafe?.img || editedCafe?.newImage) && (
              <img
                src={editedCafe.newImage ? URL.createObjectURL(editedCafe.newImage) : editedCafe.img}
                alt="รูปภาพคาเฟ่"
                style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
              />
            )}
          </Form.Group>
          <Button variant="primary" type="submit">
            บันทึกการแก้ไข
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ModaleditCafe;
