import React, { useState, useContext, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { AuthContext } from '../context/Authcontext'
import { Hostname } from '../config'
import axios from 'axios'

function ProfilePage() {
  const { user, updateUser } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setProfileImage(null);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('userID', user.userID);
      formData.append('username', username);
      formData.append('profileImage', profileImage);

      let config = {
        method: 'post',
        url: `${Hostname}/api/profile.php`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      console.log('Sending data:', Object.fromEntries(formData));

      const response = await axios.request(config);
      console.log('Response:', response.data);

      if (response.data.status === 'success') {
        const updatedUser = { ...user, username };
        if (profileImage) {
          updatedUser.profileImage = response.data.profileImage;
        }
        updateUser(updatedUser);

        alert('Profile updated successfully');
      } else {
        console.log(response.data);
        alert(`Failed to update profile: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile');
    }
  };

  return (
    <div>
      <h2>ข้อมูลส่วนตัว</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>ชื่อผู้ใช้</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group> 
        <Form.Group className="mb-3" controlId="formBasicProfilePicture">
          <Form.Label>รูปโปรไฟล์</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setProfileImage(file);
              }
            }}
          />
          {user.profileImage && (
            <img
              src={`${Hostname}/${user.profileImage}`}
              alt="Current Profile"
              style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
            />
          )}
        </Form.Group>

        <Button variant="primary" type="submit">
          บันทึกการเปลี่ยนแปลง
        </Button>
      </Form>
    </div>
  )
}

export default ProfilePage