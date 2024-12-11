import { useState } from 'react';
import api from '../../../services/api';
export function useFetchData() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const consultarAeropuerto = async (code) => {
        setIsLoading(true);
        setError(null);
        try {
            // Agregamos await para esperar correctamente la respuesta del servidor
            const response = await api.post('/aeropuertos', {
                code: code
            });
      
            const aeropuertos = response.data.cities.flatMap(city => city.new_airports.map(airport => ({
                nombre: airport.nameAirport,
                codigoIATA: airport.codeIataAirport,
                ciudad: city.nameCity,
                pais: city.new_country?.nameCountry
            })));
            console.log(aeropuertos)

            return aeropuertos;
            
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { consultarAeropuerto, isLoading, error };
}
