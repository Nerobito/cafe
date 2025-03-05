import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { Hostname } from '../config';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('role', 'user');

    try {
      const response = await fetch(`${Hostname}/api/register.php`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMessage({ type: 'success', text: 'ลงทะเบียนสำเร็จ!' });
        // รีเซ็ตฟอร์ม
        setUsername('');
        setPassword('');
      } else {
        setMessage({ type: 'danger', text: data.message || 'เกิดข้อผิดพลาดในการลงทะเบียน' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'danger', text: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์' });
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center mb-4">สมัครสมาชิก</h2>
          {message && (
            <Alert variant={message.type}>{message.text}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>ชื่อผู้ใช้</Form.Label>
              <Form.Control
                type="text"
                placeholder="กรอกชื่อผู้ใช้"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>รหัสผ่าน</Form.Label>
              <Form.Control
                type="password"
                placeholder="กรอกรหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              สมัครสมาชิก
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;