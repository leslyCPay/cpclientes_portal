import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import App from './App';


const currentYear = new Date().getFullYear();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Header />
    <App/>
    <Footer copyrightText={ `Copyright © ${currentYear}`} />
  </React.StrictMode>
);

