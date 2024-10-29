import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Bienvenida from './Bienvenida.jsx'
import Usuario from './Usuario.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Bienvenida />
    <Usuario />
  </StrictMode>,
)
