import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Hostname } from '../config';
import ModaleditCafe from '../components/ModaleditCafe';
import Swal from 'sweetalert2';

function UserPosts({ user }) {
  const [cafes, setCafes] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState(null);

  useEffect(() => {
    if (user && user.userID) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`${Hostname}/api/getUserPosts.php?userID=${user.userID}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user posts');
      }
      const data = await response.json();
      if (data.status === 'success') {
        setCafes(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch user posts');
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handleDeleteCafe = async (cafeID) => {
    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการลบร้านกาแฟนี้ใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${Hostname}/api/deletecafe.php`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `cafeID=${cafeID}`,
        });
        const data = await response.json();
        if (data.status === 'success') {
          setCafes(cafes.filter(cafe => cafe.cafeID !== cafeID));
          Swal.fire(
            'ลบสำเร็จ!',
            data.message,
            'success'
          );
        } else {
          throw new Error(data.message || 'Failed to delete cafe');
        }
      } catch (error) {
        console.error('Error deleting cafe:', error);
        Swal.fire(
          'เกิดข้อผิดพลาด!',
          'เกิดข้อผิดพลาดในการลบร้านกาแฟ กรุณาลองใหม่อีกครั้ง',
          'error'
        );
      }
    }
  };
  

  const handleEditClick = (cafe) => {
    setSelectedCafe(cafe);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedCafe(null);
  };

  const handleUpdateCafe = (updatedCafe) => {
    setCafes(cafes.map(cafe => cafe.cafeID === updatedCafe.cafeID ? updatedCafe : cafe));
  };

  return (
    <div>
      <h2>โพสต์ของคุณ</h2>
      <Row>
        {cafes.map((cafe) => (
          <Col key={cafe.cafeID} xs={12} md={6} lg={4} className="mb-4">
            <Card className="h-100">
              <Card.Img 
                variant="top" 
                src={`${Hostname}/public/${cafe.img}`} 
                alt={cafe.cafeName}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{cafe.cafeName}</Card.Title>
                <Card.Text>
                  <p>เขต: {cafe.countyName}</p>
                  <p>เวลาเปิด-ปิด: {cafe.openingHours}</p>
                </Card.Text>
                <div className="mt-auto">
                  <Button variant="primary" onClick={() => handleEditClick(cafe)}>แก้ไข</Button>
                  <Button variant="danger" className="ml-2" onClick={() => handleDeleteCafe(cafe.cafeID)}>ลบ</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {showEditModal && (
        <ModaleditCafe
          show={showEditModal}
          handleClose={handleCloseEditModal}
          cafe={selectedCafe}
          updateCafe={handleUpdateCafe}
        />
      )}
    </div>
  );
}

export default UserPosts;