import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';;
import { toast } from 'react-hot-toast';
import api from '../../../../services/api';

const useAuth = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();


  const logout = () => {
    // Eliminar el token de localStorage
    localStorage.removeItem('access_token');
    
    // Redirigir al login
    history.push('/login');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrors({});
    toast.promise(
      api.post('/login/', { correo, password }),
      {
        loading: 'Iniciando sesión...',
        success: (response) => {
          localStorage.setItem('access_token', response.data.token);

          const from = location.state?.from?.pathname || '/app/usuarios/';
          navigate(from);

          return '¡Sesión iniciada exitosamente!';
        },
        error: (error) => {
          if ("error" in error.response.data) {
            return error.response.data.error || 'Error al iniciar sesión.';
          } else {
            setErrors(error.response.data);
            return 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
          }
        },
      },
      {
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
        duration: 4000,
      }
    );
  };

  return {
    correo,
    password,
    errors,
    setCorreo,
    setPassword,
    handleLogin,
    logout
  };
};

export default useAuth;
