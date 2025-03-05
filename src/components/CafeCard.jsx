import React, { useState, useContext, useEffect } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Hostname } from '../config';
import { AuthContext } from '../context/Authcontext';
import { Link } from 'react-router-dom';
import ModalCard from './ModalCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faUser, faSignInAlt, faInfoCircle, faThumbsUp, faHeart } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import axios from 'axios';

const CafeCard = ({ cafe, onLike, isLoggedIn, isFavorite: initialIsFavorite, onRemoveFavorite }) => {
  const [likes, setLikes] = useState(cafe.likes);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  useEffect(() => {
    if (isLoggedIn && user) {
      checkLikeStatus(cafe.cafeID);
      checkFavoriteStatus(cafe.cafeID);
    } else {
      setIsLiked(false);
      setIsFavorite(false);
      setLikes(cafe.likes);
    }
    
  }, [isLoggedIn, user, cafe.cafeID, cafe.likes]);

  const checkLikeStatus = async (cafeID) => {
    try {
      const response = await fetch(`${Hostname}/api/checkLikeStatus.php?cafeID=${cafeID}&userID=${user.userID}`);
      const data = await response.json();
    
      setIsLiked(data.isLiked);
    } catch (error) {
      console.error('Error checking like status:', error);
      toast.error('Failed to check like status. Please try again.');
    }
  };

  const checkFavoriteStatus = async (cafeID) => {
    try {
      const response = await fetch(`${Hostname}/api/checkFavoriteStatus.php?cafeID=${cafeID}&userID=${user.userID}`);
      const data = await response.json();
      if (data.status === 'success') {
        setIsFavorite(data.isFavorite);
      } else {
        console.error('Error checking favorite status:', data.message);
        toast.error('Failed to check favorite status. Please try again.');
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
      toast.error('Failed to check favorite status. Please try again.');
    }
  };

  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      return; // Do nothing if not logged in
    }

    try {
      const formData = new FormData();
      formData.append('cafeID', cafe.cafeID);
      formData.append('userID', user.userID);
      
      const response = await fetch(`${Hostname}/api/likes.php`, {
        method: 'POST',
        body: formData,
      });
    
      const data = await response.json();
      if (data.status === 'success') {
        setLikes(data.likes);
        setIsLiked(data.isLiked);
        onLike(cafe.cafeID, data.likes);
      } else {
        toast.error('Failed to update like. Please try again.');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like. Please try again.');
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isLoggedIn) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('userID', user.userID);
      formData.append('cafeID', cafe.cafeID);
      console.log(user );  
      const config = {
        method: 'post',
        url: `${Hostname}/api/toggleFavorite.php`,
        data: formData
      };

      const response = await axios.request(config);
      const data = response.data;

      if (data.status === 'success') {
        setIsFavorite(data.isFavorite);
        if (!data.isFavorite && onRemoveFavorite) {
          onRemoveFavorite(cafe.cafeID);
        }
        toast.success(data.isFavorite ? 'Added to favorites' : 'Removed from favorites');
      } else {
        throw new Error(data.message || 'Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error.message);
      toast.error('Failed to update favorite status. Please try again.');
    }
  };
  

  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Card className="h-100 cafe-card mb-3">
        <Card.Img 
          variant="top" 
          src={`${Hostname}/public/${cafe.img}`} 
          alt={cafe.cafeName} 
          className="cafe-image" 
          style={{ height: '200px', objectFit: 'cover' }} 
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title className="cafe-title">{cafe.cafeName}</Card.Title>
          <Card.Text className="flex-grow-1">เขต: {cafe.countyName}</Card.Text>
          <Card.Text className="flex-grow-1">
            <Button 
              variant="link" 
              onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(cafe.cafeName)}`, '_blank')}
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </Button>
          </Card.Text>
          <Row className="mt-auto">
            <Col>
              <Card.Text><small className="text-muted">Opening Hours: {cafe.openingHours}</small></Card.Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card.Text><small className="text-muted">Likes: {likes}</small></Card.Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card.Text>
                <small className="text-muted">
                  <FontAwesomeIcon icon={faUser} /> Posted by: {cafe.postedBy}
                </small>
              </Card.Text>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center">
          <Button variant="link" onClick={handleShowModal}>
            <FontAwesomeIcon icon={faInfoCircle} size="lg" />
          </Button>
          {isLoggedIn ? (
            <>
              <Button 
                variant="link"
                onClick={handleLikeToggle}
              >
                <FontAwesomeIcon 
                  icon={faThumbsUp} 
                  size="lg" 
                  color={isLiked ? "blue" : "gray"}
                />
              </Button>
              <Button 
                variant="link"
                onClick={handleFavoriteToggle}
              >
                <FontAwesomeIcon 
                  icon={faHeart} 
                  size="lg" 
                  color={isFavorite ? "red" : "gray"}
                />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="link">
                  <FontAwesomeIcon icon={faSignInAlt} size="lg" />
                </Button>
              </Link>
              <Button 
                variant="link"
                onClick={handleFavoriteToggle}
              >
                <FontAwesomeIcon 
                  icon={faHeart} 
                  size="lg" 
                  color={isFavorite ? "red" : "gray"}
                />
              </Button>
            </>
          )}
        </Card.Footer>
      </Card>
      <ModalCard 
        show={showModal} 
        handleClose={handleCloseModal} 
        cafe={cafe}
        isLoggedIn={isLoggedIn}
        user={user}
      />
    </>
  );
};

export default CafeCard;