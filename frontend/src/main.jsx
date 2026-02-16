import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import './index.css';

import Home from './pages/home/home';
import Agendamentos from './pages/agendamentos/agendamentos';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scheduling" element={<Agendamentos />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
