import { useState } from 'react';
import api from '../../../services/api';

export const useDisableStatus = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    const toggleStatus = async (id, currentStatus) => {
        setIsUpdating(true);
        setUpdateError(null);
        try {
            const response = await api.patch(`usuarios/${id}/estado/`); // Endpoint para cambiar estado
            return response.data.data.is_active; // Devuelve el nuevo estado desde la respuesta
        } catch (err) {
            setUpdateError(err.message || 'Error al actualizar el estado');
            throw err; // Lanza el error para manejarlo en el componente
        } finally {
            setIsUpdating(false);
        }
    };

    return { toggleStatus, isUpdating, updateError };
};
