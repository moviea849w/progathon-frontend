// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';

import { BrowserRouter } from 'react-router-dom'
createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
    <Auth0Provider
    domain="dev-pkw2j1v0uobwdgi0.us.auth0.com"
    clientId="6tWh7txDbzyFxvJbeX13wjRm97GJzzHy"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
    </Auth0Provider>
    </BrowserRouter>
 
)
