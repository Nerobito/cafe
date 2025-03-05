import React, { createContext, useState, useEffect } from 'react';
import { Hostname } from '../config';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };
  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const login = async (username, password) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(`${Hostname}/api/login.php`, formData, );
      console.log(response.data);
      if (response.data.status === 'success') {
        setIsLoggedIn(true);
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setError(null);
        return true;
      } else {
        setError(response.data.message);
        return false;
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
      setError('An error occurred while logging in. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setError(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, setUser, error, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
