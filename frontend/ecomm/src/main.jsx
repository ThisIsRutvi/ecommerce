import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ShopcontextProvider from './context/Shopcontext.jsx'
import {GoogleOAuthProvider} from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <ShopcontextProvider>
    <App />
    </ShopcontextProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
