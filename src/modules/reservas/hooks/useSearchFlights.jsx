import { useState } from 'react';
import api from '../../../services/api';

// Función para validar si la respuesta tiene resultados válidos
const hasResults = (response) => {
    // Verifica si existe la clave 'data' y si 'companies' tiene elementos
    return response && 
           response.data && 
           response.data.data && 
           response.data.data.companies && 
           response.data.data.companies.length > 0;
};

export const useSearchFlights = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);

    const searchFlights = async (payload) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post('/vuelos', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Respuesta completa:', response); // Muestra toda la respuesta para depuración
            console.log('Empresas encontradas:', response.data.data.companies); // Muestra las compañías para verificar

            // Verifica si existen resultados y asigna los companies
            if (hasResults(response)) {
                setResults(response.data.data.companies); // Asigna los resultados a 'results'
            } else {
                setError('No se encontraron aerolíneas para la búsqueda.');
                setResults([]); // Limpia los resultados si no hay datos válidos
            }
        } catch (err) {
            console.error('Error en la búsqueda:', err);
            setError(err.message || 'Error en la búsqueda');
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        searchFlights,
        isLoading,
        error,
        results, // Este 'results' ahora contiene las aerolíneas (companies)
    };
};
