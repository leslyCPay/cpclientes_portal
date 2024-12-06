import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
const currentYear = new Date().getFullYear();
const LandingPageLayout: React.FC = () => {
    return (
      <div>
        <Header />
         <Outlet />
        <Footer copyrightText={ `Copyright © ${currentYear}`} />
      </div>
    )
}
  
export default LandingPageLayout