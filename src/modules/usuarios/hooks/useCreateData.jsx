import { useState } from 'react';
import api from '../../../services/api';

export function useCreateData() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const createUsuario = async (usuario) => {
        setIsLoading(true);
        setError(null);
        try {
            // Agregamos await para esperar correctamente la respuesta del servidor
            const response = await api.post('/usuarios/crear/', {
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                cedula: usuario.cedula,
                correo: usuario.correo,
                password: usuario.password,
                estado: 1
            });
            if (response.status !== 201) {
                throw new Error('Error al crear el usuario');
            }
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { createUsuario, isLoading, error };
}
