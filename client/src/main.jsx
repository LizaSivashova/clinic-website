import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { THERAPIST } from './config/content';
import LandingPage from './pages/LandingPage.jsx';
import RequireAuth from './components/RequireAuth.jsx';

const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const AccessibilityStatement = lazy(() => import('./pages/AccessibilityStatement.jsx'));

document.title = `${THERAPIST.name} — עובדת סוציאלית קלינית`;
document.querySelector('meta[name="description"]')?.setAttribute('content',
  `${THERAPIST.name} — עובדת סוציאלית קלינית ב${THERAPIST.city}. טיפול רגשי לדיכאון, חרדה, אבל, טראומה, ייעוץ זוגי והדרכת הורים.`
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/accessibility" element={<AccessibilityStatement />} />
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
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
