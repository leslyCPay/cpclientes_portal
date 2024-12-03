import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './routes/Login';
import Cases from './routes/Cases';
import DetailCase from './routes/DetailCase';
//import App from './App';
//import LandingPageLayout from './layouts/LandingPageLayout';

const AppRoutes: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => localStorage.getItem('logged_user') !== null
  );

  useEffect(() => {
    localStorage.setItem('logged_user', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  
  //const logIn = () => setIsLoggedIn(true);

  // pass this callback to components you want to allow logging out
  // it will update the local state and then get persisted
  //const logOut = () => setIsLoggedIn(false);
  
  return (
    <Router>
      <Routes>
        <Route index path='/' element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cases" element={isLoggedIn ? <Cases /> : <Navigate to='/login'/> } />
        <Route path="/detail-case/:caseId" element={<DetailCase />} />     
      </Routes>
    </Router>
  );
};

export default AppRoutes;
