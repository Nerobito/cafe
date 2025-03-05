import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { Hostname } from '../config';
import CafeCard from '../components/CafeCard';
import { AuthContext } from '../context/Authcontext';
import Search from '../components/Search';
import ModalPost from '../components/ModalPost';

const Cafe = () => {
  const [cafes, setCafes] = useState([]);
  const [filteredCafes, setFilteredCafes] = useState([]);
  const { isLoggedIn, user } = useContext(AuthContext);
  const [showModalPost, setShowModalPost] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCafes();
  }, []);

  const fetchCafes = async () => {
    try {
      const response = await fetch(`${Hostname}/api/post.php?action=getCafes`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched cafes:', data);
      
      if (data.status === 'success' && Array.isArray(data.data)) {
        setCafes(data.data);
        setFilteredCafes(data.data);
        setError(null);
      } else if (data.status === 'success' && typeof data.data === 'object') {
        const cafeArray = Object.values(data.data);
        setCafes(cafeArray);
        setFilteredCafes(cafeArray);
        setError(null);
      } else {
        console.error('รูปแบบข้อมูลไม่ถูกต้อง:', data);
        setCafes([]);
        setFilteredCafes([]);
        setError('ไม่พบข้อมูลคาเฟ่ หรือข้อมูลอยู่ในรูปแบบที่ไม่ถูกต้อง');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลคาเฟ่:', error);
      
    }
  };

  const handleAddCafe = () => {
    setShowModalPost(true);
  };

  const handleCloseModalPost = () => setShowModalPost(false);

  const handleLike = (cafeID, newLikes) => {
    const updatedCafes = cafes.map(cafe => 
      cafe.cafeID === cafeID ? { ...cafe, likes: newLikes } : cafe
    );
    setCafes(updatedCafes);
    setFilteredCafes(updatedCafes);
  };

  const handleSearch = (searchResults) => {
    setFilteredCafes(searchResults);
  };

  return (
    <Container className="mt-4">
      <Button 
        variant="success" 
        onClick={handleAddCafe} 
        disabled={!isLoggedIn}
        className="mb-3"
      >
        {isLoggedIn ? 'เพิ่มโพสต์' : 'เข้าสู่ระบบเพื่อเพิ่มโพสต์'}
      </Button>
      <ModalPost 
        show={showModalPost} 
        handleClose={handleCloseModalPost}
      />
      <h1 className="text-center mb-4">Review Cafe</h1>
      <Search onSearch={handleSearch} cafes={cafes} />
      {error && <Alert variant="danger">{error}</Alert>}
      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredCafes.length > 0 ? (
          filteredCafes.map((cafe) => (
            <Col key={cafe.cafeID}>
              <CafeCard
                cafe={cafe}
                isLoggedIn={isLoggedIn}
                user={user}
                onLike={handleLike}
              />
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info">
              {error || 'ไม่พบข้อมูลร้านกาแฟ'}
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Cafe;