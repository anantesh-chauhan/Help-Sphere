// import { StrictMode } from 'react'
import React from 'react'; // <-- Required for JSX in some setups
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { AppContextProvider } from './context/AppContext.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <Toaster />
      <App />
    </AppContextProvider>

   </BrowserRouter>,
)
