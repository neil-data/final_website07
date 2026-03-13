import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Hard-lock dark mode for the immersive 3D experience.
document.documentElement.setAttribute('data-theme', 'dark');
localStorage.setItem('gdg-theme', 'dark');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
