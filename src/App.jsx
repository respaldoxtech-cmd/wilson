import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
// Lazy load pages or import directly for now
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Communication from './pages/Communication';
import MeetingPoints from './pages/MeetingPoints';

function App() {
  useEffect(() => {
    // Verificar si hay usuario y si es admin
    const user = JSON.parse(localStorage.getItem('pgCurrentUser') || 'null');
    if (!user || user.role !== 'admin') {
      window.location.href = '/login.html';
    }
  }, []);

  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="communication" element={<Communication />} />
          <Route path="meeting-points" element={<MeetingPoints />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
