import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Cafe from './pages/Cafe'
import Post from './pages/Post'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/cafe" element={<Cafe  />} />
    <Route path="/post" element={<Post />} />
    <Route 
      path="/admin" 
      element={<Admin />}
    />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={ <Dashboard />} />
    <Route path="/register" element={<Register />} />
    <Route path="/profile" element={<Profile />} /> 
    <Route path="*" element={<NotFound />} />
  </Routes>
  )
}

export default App
