import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { UserEntryProvider } from './contexts/UserEntryContext';
import { AuthProvider } from "react-auth-kit"
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider
      authType={"cookie"}
      authName={"_auth"}
      cookieDomain={window.location.hostname}
      cookieSecure={false}
    >
      <UserEntryProvider>
        <App />
      </UserEntryProvider>
    </AuthProvider>
  </React.StrictMode>,
)