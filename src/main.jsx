import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App';

// 🔥 Wake up the Render backend immediately on page load
// Free-tier Render sleeps after 15min of inactivity. This silent ping
// triggers the cold start (~30-50s) while the user reads the hero section.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
fetch(`${API_URL}/health`, { method: 'GET', mode: 'cors' }).catch(() => {});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
