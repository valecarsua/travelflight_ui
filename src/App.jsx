// importaciones de react
import './index.css';
import { Routes, Route } from 'react-router-dom';

// importaciones generales 
import Login from './modules/Core/login/components/login.jsx'
import Sidebar from './modules/Core/sidebar/components/sidebar.jsx'
import ProtectedRoute from './modules/Core/ProtectedRoute/components/ProtectedRoute.jsx';

// importaciones de modulos
import Usuarios from './modules/usuarios/components/usuarios.jsx'
import Reservas from './modules/reservas/components/reservas.jsx';
import MisReservas from './modules/reservas/components/misReservas.jsx';
const App = () => {
    return (
        <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/app" element={<ProtectedRoute><Sidebar /></ProtectedRoute>}>
                    
                    <Route path="usuarios" element={<Usuarios />} />
                    <Route path="reservas" element={<Reservas />} />
                    <Route path="mis-reservas" element={<MisReservas />} />
                </Route>
            </Routes>
    );
};

export default App;