import React, { useState, useEffect } from 'react';
import { Table, Container, Button } from 'react-bootstrap';
import { Hostname } from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ModaleditCafe from '../components/ModaleditCafe';
import Swal from 'sweetalert2';

function Admin() {
  const [users, setUsers] = useState({});
  const [cafes, setCafes] = useState({});
  const [showEditCafeModal, setShowEditCafeModal] = useState(false);
  
  const [selectedCafe, setSelectedCafe] = useState(null);


  useEffect(() => {
    fetchUsers();
    fetchCafes();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${Hostname}/api/user.php`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === 'success') {
        setUsers(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error.message);
      Swal.fire('Error', 'Failed to fetch users', 'error');
    }
  };

  
  const deleteUser = async (userID) => {
    try {
      const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: "คุณไม่สามารถย้อนกลับการกระทำนี้ได้!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก'
      });

      if (result.isConfirmed) {
        const response = await fetch(`${Hostname}/api/deleteuser.php`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `userID=${userID}`,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.message === "User deleted successfully.") {
          Swal.fire('ลบแล้ว!', 'ผู้ใช้ถูกลบเรียบร้อยแล้ว', 'success');
          const newUsers = { ...users };
          delete newUsers[userID];
          setUsers(newUsers);
        } else {
          throw new Error(data.message);
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error.message);
      Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถลบผู้ใช้ได้', 'error');
    }
  };

  const fetchCafes = async () => {
    try {
      const response = await fetch(`${Hostname}/api/post.php?action=getCafes`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Raw API response:', result);
      if (result.status === 'success' && typeof result.data === 'object') {
        console.log('Cafes data:', result.data);
        setCafes(result.data);
      } else if (result.status === 'success' && Object.keys(result.data).length === 0) {
        console.log('No cafes found');
        setCafes({});
      } else {
        throw new Error(result.message || 'Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching cafes:', error.message);
      Swal.fire('Error', 'Failed to fetch cafes', 'error');
      setCafes({});
    }
  };

  const deleteCafe = async (cafeID) => {
    try {
      const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: "คุณไม่สามารถย้อนกลับการกระทำนี้ได้!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก'
      });

      if (result.isConfirmed) {
        const response = await fetch(`${Hostname}/api/deletecafe.php`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `cafeID=${cafeID}`,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === "success") {
          Swal.fire(
            'ลบแล้ว!',
            'คาเฟ่ถูกลบเรียบร้อยแล้ว',
            'success'
          );
          const newCafes = { ...cafes };
          delete newCafes[cafeID];
          setCafes(newCafes);
        } else {
          throw new Error(data.message);
        }
      }
    } catch (error) {
      console.error('Error deleting cafe:', error.message);
      Swal.fire(
        'เกิดข้อผิดพลาด!',
        'ไม่สามารถลบคาเฟ่ได้',
        'error'
      );
    }
  };

  const handleEditClick = (cafe) => {
    setSelectedCafe(cafe);
    setShowEditCafeModal(true);
  };

  

  const updateCafe = async (cafeId, formData) => {
    try {
      const response = await fetch(`${Hostname}/api/editcafe.php`, {
        method: 'POST',
        body: formData,
      });
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (data.status === 'success') {
          setCafes(prevCafes => ({
            ...prevCafes,
            [cafeId]: { ...prevCafes[cafeId], ...Object.fromEntries(formData) }
          }));
          Swal.fire('สำเร็จ', 'อัปเดตข้อมูลคาเฟ่เรียบร้อยแล้ว', 'success');
        } else {
          throw new Error(data.message || 'Failed to update cafe');
        }
        return data;
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text}`);
      }
    } catch (error) {
      console.error('Error updating cafe:', error);
      Swal.fire('เกิดข้อผิดพลาด', `ไม่สามารถอัปเดตข้อมูลคาเฟ่ได้: ${error.message}`, 'error');
      return { status: 'error', message: error.message };
    }
  };

  

  return (
    <Container>
      <h1 className="my-4">Admin Dashboard</h1>
      
      <h2>User Management</h2>
      <Table striped bordered hover>
        <thead>
          <tr>  
            <th>รหัสผู้ใช้</th>
            <th>ชื่อผู้ใช้</th>
            <th>รูปโปรไฟล์</th>
            <th>สิทธิ์</th>
            <th>ลบ</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(users).map((user) => (
            <tr key={user.userID}>
              <td>{user.userID}</td>
              <td>{user.username}</td>
              <td>{user.proflieImage}</td>
              <td>{user.role}</td>
             
              <td>
                <Button variant="danger" size="sm" onClick={() => deleteUser(user.userID)}>
                  <FontAwesomeIcon icon={faTrash} /> ลบ
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 className="mt-5">Cafe Management</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ชื่อคาเฟ่</th>
            <th>รูปภาพ</th>
            <th>รายละเอียด</th>
            <th>เขต</th>
            <th>แก้ไข</th>
            <th>ลบ</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(cafes).length > 0 ? (
            Object.values(cafes).map((cafe) => (
              <tr key={cafe.cafeID}>
                <td>{cafe.cafeName}</td>
                <td>
                  <img src={cafe.img} alt={cafe.cafeName} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                </td>
                <td>{cafe.detailsCafe}</td>
                <td>{cafe.countyName}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleEditClick(cafe)}>
                    <FontAwesomeIcon icon={faEdit} /> แก้ไข
                  </Button>{' '}
                </td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => deleteCafe(cafe.cafeID)}>
                    <FontAwesomeIcon icon={faTrash} /> ลบ
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">ไม่พบข้อมูลร้านกาแฟ</td>
            </tr>
          )}
        </tbody>
      </Table>

      <ModaleditCafe 
        show={showEditCafeModal} 
        handleClose={() => setShowEditCafeModal(false)} 
        cafe={selectedCafe} 
        updateCafe={updateCafe} 
      />

    
    </Container>
  );
}

export default Admin;