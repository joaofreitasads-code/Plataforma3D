import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Unregister legacy service workers to prevent cross-origin image fetch failures
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().catch(() => {});
    }
  }).catch(() => {});
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name).catch(() => {}));
    }).catch(() => {});
  }
}

createRoot(document.getElementById('root')!).render(<App />);
