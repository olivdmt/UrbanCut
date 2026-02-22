import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import PrivateRoute from './pages/routes/PrivateRoute';

import './index.css';

import Home from './pages/home/home';
import Agendamentos from './pages/agendamentos/agendamentos';
import AdminPage from  './pages/admin/admin';
import Dashboard from './pages/dashboardAdmin/dashboardAdmin';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rotas publicas qualquer um pode acessar*/}
        <Route path="/" element={<Home />} />
        <Route path="/scheduling" element={<Agendamentos />} />
        <Route path="/adminPage" element={<AdminPage />} />

        {/* Rotas protegidas*/}
        <Route
          path='/dashboard'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
         />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
