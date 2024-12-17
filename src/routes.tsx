import React from 'react';
import { BrowserRouter as  Routes, Route, Navigate } from 'react-router-dom';
import Login from './routes/Login';
import Cases from './routes/Cases';
import DetailCase from './routes/DetailCase';


interface AppRoutesProps { 
  isLoggedIn: boolean; 
  setIsLoggedIn: (loggedIn: boolean) => void; 
}

const AppRoutes: React.FC<AppRoutesProps> = ({ isLoggedIn, setIsLoggedIn }) => { 
  
  return (
      <Routes >
        <Route index path='/' element={<Navigate to={isLoggedIn ? "/cases" : "/login"} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/cases" element={isLoggedIn ? <Cases /> : <Navigate to='/login'/> } />
        <Route path="/detail-case/:caseId" element={<DetailCase />} />     
      </Routes>
  );
};

export default AppRoutes;
