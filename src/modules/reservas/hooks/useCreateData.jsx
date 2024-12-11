import { useState } from 'react';
import api from '../../../services/api';

export function useCreateData() {
    const [isLoadingCreate, setIsLoadingCreate] = useState(false);
    const [error, setError] = useState(null);

    const createReserva = async (reserva) => {
    
        setError(null);
        try {
            // Agregamos await para esperar correctamente la respuesta del servidor
            const response = await api.post('/reservas/crear/', {
                origen: reserva.origen,
                destino: reserva.destino,
                fecha: reserva.fecha,
               
            });
            if (response.status !== 201) {
                throw new Error('Error al crear la reserva');
            }
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } 
    };

    return { createReserva, error };
}
