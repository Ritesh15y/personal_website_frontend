import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App';

import { API_BASE_URL } from './shared/lib/api';

// 🔥 Wake up the Render backend immediately on page load
// Free-tier Render sleeps after 15min of inactivity. This silent ping
// triggers the cold start (~30-50s) while the user reads the hero section.
fetch(`${API_BASE_URL}/health`, { method: 'GET', mode: 'cors' }).catch(() => {});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
