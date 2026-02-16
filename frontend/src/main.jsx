import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import './index.css';

import Home from './pages/home/home';
import Agendamentos from './pages/agendamentos/agendamentos';
import AdminPage from  './pages/admin/admin';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scheduling" element={<Agendamentos />} />
        <Route path="/adminPage" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
