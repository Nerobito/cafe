import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Hostname } from '../config';
import CafeCard from '../components/CafeCard';
import { AuthContext } from '../context/Authcontext';

const Cafe = () => {
  const [cafes, setCafes] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    fetchCafes();
  }, []);

  const fetchCafes = async () => {
    try {
      const response = await fetch(`${Hostname}/api/post.php`);
      const data = await response.json();
      setCafes(data);
    } catch (error) {
      console.error('Error fetching cafes:', error);
    }
  };

  const handleLike = (cafeID, newLikes) => {
    setCafes(cafes.map(cafe => 
      cafe.cafeID === cafeID ? { ...cafe, likes: newLikes } : cafe
    ));
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Cafe List</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {cafes.map((cafe) => (
          <Col key={cafe.cafeID}>
            <CafeCard cafe={cafe} onLike={handleLike} isLoggedIn={isLoggedIn} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Cafe;