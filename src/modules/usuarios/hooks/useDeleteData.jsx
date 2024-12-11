import { useState } from 'react';
import api from '../../../services/api';

export const useDeleteData = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const deleteUsuario = async (id) => {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            const response = await api.delete(`usuarios/eliminar/${id}/`); // Endpoint para eliminar tipo de lista
            return response.data; // Devuelve la respuesta en caso de éxito
        } catch (err) {
            setDeleteError(err.message || 'Error al eliminar el usuario');
            throw err; // Lanza el error para manejarlo en el componente
        } finally {
            setIsDeleting(false);
        }
    };

    return { deleteUsuario, isDeleting, deleteError };
};
