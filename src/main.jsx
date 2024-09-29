import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import CustomNavbar from './Navbar.jsx'
import { AuthProvider } from './context/Authcontext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CustomNavbar />
        <App />
        </AuthProvider>
      </BrowserRouter>
  </StrictMode>,
)
