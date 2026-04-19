import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
 <GoogleOAuthProvider clientId="980795496607-cu74s23mantlk7c3nfi4mpe406ejmg7n.apps.googleusercontent.com">
  <StrictMode>
    <App />
  </StrictMode>
</GoogleOAuthProvider>
)