import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import JobCreatePage from './pages/JobCreatePage';
import JobDetailPage from './pages/JobDetailPage';
import JobEditPage from './pages/JobEditPage';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

const Layout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/create-job') || location.pathname.startsWith('/edit-job');
  
  return (
    <>
      {!isDashboard && <Navbar />} 
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />

          {/* PRIVATE ROUTES */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/create-job" element={<PrivateRoute><JobCreatePage /></PrivateRoute>} />
          <Route path="/edit-job/:id" element={<PrivateRoute><JobEditPage /></PrivateRoute>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;