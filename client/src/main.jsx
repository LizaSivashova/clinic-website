import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { THERAPIST } from './config/content';

document.title = `${THERAPIST.name} — עובדת סוציאלית קלינית`;
document.querySelector('meta[name="description"]')?.setAttribute('content',
  `${THERAPIST.name} — עובדת סוציאלית קלינית ב${THERAPIST.city}. טיפול רגשי לדיכאון, חרדה, אבל, טראומה, ייעוץ זוגי והדרכת הורים.`
);
import LandingPage from './pages/LandingPage.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import RequireAuth from './components/RequireAuth.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
