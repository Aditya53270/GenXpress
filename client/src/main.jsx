// src/main.jsx
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext'; // ✅ Import your context provider

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppProvider> {/* ✅ Wrap App with context */}
      <App />
    </AppProvider>
  </BrowserRouter>
);