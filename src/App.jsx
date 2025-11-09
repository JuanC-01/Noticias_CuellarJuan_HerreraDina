// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'; 
import PublicLayout from './layouts/PublicLayout'; 
import PublicHome from './Pages/PublicHome/PublicHome';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import NewsView from './Pages/NewsView/NewsView';
import Dashboard from './Pages/Dashboard/Dashboard'; 
import RutaProtegida from './components/RutaProtegida';
import SectionView from './Pages/SectionView/SectionView';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: '1' }}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<PublicHome />} />
              <Route path="/noticia/:id" element={<NewsView />} />
              <Route path="/seccion/:slug" element={<SectionView />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/editor-panel/*"
              element={
                <RutaProtegida>
                  <Dashboard />
                </RutaProtegida>
              }
            />
            <Route
              path="/reportero-panel/*"
              element={
                <RutaProtegida>
                  <Dashboard />
                </RutaProtegida>
              }
            />
            <Route path="*" element={<h1>Página no encontrada</h1>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
