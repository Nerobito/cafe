import React, { useState, useContext, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Hostname } from '../config';
import { AuthContext } from '../context/Authcontext';
import { Link } from 'react-router-dom';

const CafeCard = ({ cafe, onLike, isLoggedIn }) => {
  const [likes, setLikes] = useState(parseInt(cafe.likes));
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn && user) {
      checkLikeStatus();
    }
  }, [isLoggedIn, user, cafe.cafeID]);

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`${Hostname}/api/checkLikeStatus.php?cafeID=${cafe.cafeID}&userID=${user.id}`);
      const data = await response.json();
      setIsLiked(data.isLiked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      return; // Do nothing if not logged in
    }

    try {
      const formData = new FormData();
      formData.append('cafeID', cafe.cafeID);
      formData.append('userID', user.id);

      const response = await fetch(`${Hostname}/api/likes.php`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.status === 'success') {
        setLikes(data.likes);
        setIsLiked(!isLiked);
        onLike(cafe.cafeID, data.likes);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <Card className="h-100 cafe-card">
      <Card.Img variant="top" src={cafe.img} alt={cafe.cafeName} className="cafe-image" />
      <Card.Body>
        <Card.Title className="cafe-title">{cafe.cafeName}</Card.Title>
        <Card.Text>{cafe.detailsCafe}</Card.Text>
        <Card.Text>Opening Hours: {cafe.openingHours}</Card.Text>
        <Card.Text>Likes: {likes}</Card.Text>
        <Card.Text>Reviews: {cafe.reviews}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Button variant="primary" className="me-2">View Details</Button>
        {isLoggedIn ? (
          <Button 
            variant={isLiked ? "outline-danger" : "outline-success"}
            onClick={handleLikeToggle}
          >
            {isLiked ? "Unlike" : "Like"}
          </Button>
        ) : (
          <Link to="/login">
            <Button variant="outline-secondary">Login to Like</Button>
          </Link>
        )}
      </Card.Footer>
    </Card>
  );
};

export default CafeCard;
