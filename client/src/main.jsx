import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import { AppContextProvider } from './context/AppContext'
import './index.css' 
// Clerk Key ko env se read kar rahe hain
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key. Please add it to your .env file.")
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </ClerkProvider>
)