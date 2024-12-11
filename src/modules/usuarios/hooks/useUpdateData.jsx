import { useState } from 'react';
import api from '../../../services/api';

export const useUpdateData = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    const updateUsuario = async (id, data) => {
        setIsUpdating(true);
        setUpdateError(null);
        try {
            let carga = {
                ...data,
                estado: 1
            } 
            await api.put(`usuarios/editar/${id}/`, carga);
        } catch (err) {
            setUpdateError(err.message || 'Error al actualizar el registro');
        } finally {
            setIsUpdating(false);
        }
    };

    return { updateUsuario, isUpdating, updateError };
};
