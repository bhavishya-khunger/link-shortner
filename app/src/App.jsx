import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layouts/app.layout.jsx';
import Landing from './pages/Landing.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Link from './pages/Link.jsx';
import Redirect from './pages/Redirect.jsx';
import UrlProvider from './context.jsx'
import RequireAuth from './components/require-auth.jsx';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Landing />
      },
      {
        path: '/auth',
        element: <Auth />
      },
      {
        path: '/dashboard',
        element:
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
      },
      {
        path: '/link/:id',
        element:
          <RequireAuth>
            <Link />
          </RequireAuth>
      },
      {
        path: '/:id',
        element: <Redirect />
      }
    ]
  }
]);

const App = () => {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  )
}

export default App
