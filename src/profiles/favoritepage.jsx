import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/Authcontext';
import { Hostname } from '../config';

import { Row, Col, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

function FavoritePage() {
  const [favorites, setFavorites] = useState([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${Hostname}/api/getFavorites.php`, {
        params: { userID: user.userID }
      });
      if (response.data.status === 'success') {
        setFavorites(response.data.favorites.map(favorite => ({
          ...favorite,
          cafeID: parseInt(favorite.cafeID),
          favoriteID: parseInt(favorite.favoriteID)
        })));
        console.log(response.data.favorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to fetch favorites');
    }
  };

  const handleRemoveFavorite = async (cafeID) => {
    try {
      const formData = new FormData();
      formData.append('userID', user.userID);
      formData.append('cafeID', cafeID);

      const response = await axios.post(`${Hostname}/api/toggleFavorite.php`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status === 'success') {
        setFavorites(favorites.filter(cafe => cafe.cafeID !== cafeID));
        toast.success('Favorite removed successfully');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  return (
    <div>
      <h2>รายการโปรดของคุณ</h2>
      {favorites.length > 0 ? (
        <Row>
          {favorites.map(cafe => (
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
                    <p>จังหวัด: {cafe.countyName}</p>
                    <p>เวลาเปิด-ปิด: {cafe.openingHours}</p>
                    <p>จำนวนไลค์: {cafe.likes}</p>
                  </Card.Text>
                  <Button 
                    variant="danger" 
                    onClick={() => handleRemoveFavorite(cafe.cafeID)}
                    className="mt-auto"
                  >
                    ลบออกจากรายการโปรด
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>คุณยังไม่มีรายการโปรด</p>
      )}
    </div>
  );
}

export default FavoritePage;