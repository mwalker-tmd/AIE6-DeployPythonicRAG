import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

//TEMP: Looking for cause of Runtime Error.
console.log("🌐 VITE_API_URL is:", import.meta.env.VITE_API_URL)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
