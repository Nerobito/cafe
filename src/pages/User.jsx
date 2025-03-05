import React, { useState, useContext } from 'react';
import { Container, Row, Col, Nav, Image, Card } from 'react-bootstrap';
import { FaUserCircle, FaHeart, FaList } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import ProfilePage from '../profiles/profilepage';
import FavoritePage from '../profiles/favoritepage';
import UserPosts from '../profiles/userPosts';
import { AuthContext } from '../context/Authcontext';

function User() {
  const [activePage, setActivePage] = useState('profile');
  const { user, isLoggedIn } = useContext(AuthContext);
  const { userID, favoriteID } = useParams();

  if (!isLoggedIn) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Card className="text-center p-5 shadow">
          <Card.Body>
            <h2>กรุณาเข้าสู่ระบบ</h2>
            <p className="text-muted">โปรดเข้าสู่ระบบเพื่อดูข้อมูลผู้ใช้</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'profile':
        return <ProfilePage user={user} />;
      case 'favorites':
        return <FavoritePage userID={userID} favoriteID={favoriteID} />;
      case 'posts':
        return <UserPosts user={user} />;
      default:
        return <ProfilePage user={user} />;
    }
  };

  return (
    <Container fluid className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={3} lg={2} className="mb-4 mb-md-0">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <Image
                src={user.profileImage || "https://via.placeholder.com/150"}
                roundedCircle
                width={120}
                height={120}
                className="mb-3 border shadow-sm"
              />
              <h4 className="mb-3">{user.username || "ผู้ใช้"}</h4>
              <Nav className="flex-column">
                <Nav.Link
                  onClick={() => setActivePage('profile')}
                  active={activePage === 'profile'}
                  className="mb-2"
                >
                  <FaUserCircle className="me-2" /> ข้อมูลส่วนตัว
                </Nav.Link>
                <Nav.Link
                  onClick={() => setActivePage('posts')}
                  active={activePage === 'posts'}
                  className="mb-2"
                >
                  <FaList className="me-2" /> โพสต์ของฉัน
                </Nav.Link>
                <Nav.Link
                  onClick={() => setActivePage('favorites')}
                  active={activePage === 'favorites'}
                  className="mb-2"
                >
                  <FaHeart className="me-2" /> รายการโปรด
                </Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={9} lg={10}>
          <Card className="shadow-sm">
            <Card.Body>
              {renderActivePage()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default User;