import React from 'react';
import AppRoutes from './routes';

const App: React.FC = () => {
  
  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
};

export default App;

/*import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router'
import LandingPageLayout from './layouts/LandingPageLayout';
import Login from './routes/Login';
import Cases from './routes/Cases';
import DetailCase from './routes/DetailCase';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPageLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: '/cases',
        element: <Cases />,
      },
      {
        path: '/detail-case',
        element: <DetailCase />,
      },
    ],
  },
]);

export const App = () => <RouterProvider router={router} />;*/