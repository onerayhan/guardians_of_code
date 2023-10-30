import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { UserProvider } from './contexts/UserContext'
import { UserEntryProvider } from './contexts/UserEntryContext';
import './tailwind.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <UserEntryProvider>
        <App />
      </UserEntryProvider>  
    </UserProvider>
  </React.StrictMode>,
)
