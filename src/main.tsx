import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes';

const currentYear = new Date().getFullYear();

const MainApp: React.FC = () => { 
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => localStorage.getItem('logged_user') !== null); 
  const navigate = useNavigate();
  
  const handleSignOut = () => { 
    localStorage.removeItem('logged_user'); 
    setIsLoggedIn(false); 
    navigate('/login');
  }; 
  
  return (     
    <> 
    <Header isLoggedIn={isLoggedIn} onSignOut={handleSignOut} /> 
    <AppRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> 
    <Footer copyrightText={`Copyright © ${currentYear}`} /> 
    </>
  ); 
};

const AppWrapper: React.FC = () => ( 
  <Router> 
  <MainApp /> 
  </Router> 
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>    
    <AppWrapper />  
  </React.StrictMode>
);

