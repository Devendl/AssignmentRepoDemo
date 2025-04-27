import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LOGR from './LoginPage/LOGR.jsx'
import Register from './RegisterPage/Register.jsx'
import Dashboard from './Dashboard/Dashboard.jsx'
import HomeP from './HomePage/HomeP.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeP />
  },
  {
    path: '/login',
    element: <LOGR />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
