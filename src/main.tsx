// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Workbox } from 'workbox-window';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Registrar Service Worker sin debug
if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');
  wb.register();
}
