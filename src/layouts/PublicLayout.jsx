// src/layouts/PublicLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Navbar from '../components/Navbar/Navbar';

const PublicLayout = () => {
  return (
    <>
      <Navbar /> 
      
      <div style={{ padding: '20px' }}>
        <Outlet />
      </div>
    </>
  );
};

export default PublicLayout;