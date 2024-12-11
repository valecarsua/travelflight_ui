import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const useSessionNotifications = () => {
  useEffect(() => {
    const sessionExpired = localStorage.getItem('session_expired');
    if (sessionExpired) {
      toast.error('Su sesión ha caducado. Por favor, inicie sesión nuevamente.', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
        duration: 3000,
      });
      localStorage.removeItem('session_expired');
    }

    const closedSession = localStorage.getItem('closed_session');
    if (closedSession) {
      toast.success('Sesión cerrada correctamente.', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
        duration: 3000,
      });
      localStorage.removeItem('closed_session');
    }
  }, []);
};

export default useSessionNotifications;
