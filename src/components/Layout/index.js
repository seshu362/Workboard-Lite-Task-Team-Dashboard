import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './index.css';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h1>Workboard Lite</h1>
          </div>
          <div className="nav-links">
            <Link 
              to="/projects" 
              className={location.pathname === '/projects' || location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Projects
            </Link>
            <Link 
              to="/team" 
              className={location.pathname === '/team' ? 'nav-link active' : 'nav-link'}
            >
              Team
            </Link>
          </div>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;