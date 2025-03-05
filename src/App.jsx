import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Cafe from './pages/Cafe'
import Admin from './pages/Admin'
import Login from './pages/Login'

import Register from './pages/Register'
import User from './pages/User'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/cafe" element={<Cafe  />} />
    
    <Route 
      path="/admin" 
      element={<Admin />}
    />
    <Route path="/login" element={<Login />} />
   
    <Route path="/register" element={<Register />} />
    <Route path="/user" element={<User />} /> 
    <Route path="*" element={<NotFound />} />
  </Routes>
  )
}

export default App
