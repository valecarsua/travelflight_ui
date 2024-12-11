import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../../services/api';

const useFetchDataReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados para paginación, búsqueda y ordenamiento
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderDirection, setOrderDirection] = useState('asc');
    const [valueToOrderBy, setValueToOrderBy] = useState('origen');

    const fetchData = async () => {
        setIsLoading(true);
        setError(null); // Resetear error al hacer una nueva solicitud
        try {
            const response = await api.get('reservas');
            console.log('Response from API:', response); // Verifica la estructura completa de la respuesta

            // Mapeo de datos: formatear fechas antes de guardarlas en el estado
            const data = response.data.data.map((item) => ({
                ...item,
                created_at: format(new Date(item.created_at || new Date()), "d 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: es }),
                updated_at: format(new Date(item.updated_at || new Date()), "d 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: es }),
            }));

            console.log('Mapped Data:', data); // Verifica que los datos estén mapeados correctamente
            setReservas(data); // Actualizar el estado con los datos mapeados
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message || 'Error al obtener las reservas'); // Manejo de errores
        } finally {
            setIsLoading(false); // Finalmente, asegúrate de desactivar la carga
        }
    };

    // Llamada a la función `fetchData` cuando el componente se monta o cambia alguno de los parámetros relevantes
    useEffect(() => {
        fetchData();
    }, []);

    // Función de búsqueda
    const handleSearchChange = (query) => {
        setSearchQuery(query.toLowerCase());
        setPage(0); // Reinicia la paginación al buscar
    };

    // Función de cambio de página
    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    // Función de cambio de filas por página
    const handleChangeRowsPerPage = (rows) => {
        setRowsPerPage(rows);
        setPage(0); // Reinicia a la primera página
    };

    // Función de ordenamiento
    const createSortHandler = (property) => {
        const isAscending = valueToOrderBy === property && orderDirection === 'asc';
        setOrderDirection(isAscending ? 'desc' : 'asc');
        setValueToOrderBy(property);
    };

    // Filtrar, ordenar y paginar los datos
    const filteredData = reservas.filter((reserva) =>
        reserva.origen.toLowerCase().includes(searchQuery)
    );

    const sortedData = filteredData.sort((a, b) => {
        if (a[valueToOrderBy] < b[valueToOrderBy]) {
            return orderDirection === 'asc' ? -1 : 1;
        }
        if (a[valueToOrderBy] > b[valueToOrderBy]) {
            return orderDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    
    return {
        reservas: paginatedData,
        setReservas,
        isLoading,
        error,
        totalCount: sortedData.length,
        page,
        rowsPerPage,
        orderDirection,
        valueToOrderBy,
        handleSearchChange,
        handleChangePage,
        handleChangeRowsPerPage,
        createSortHandler,
        refetch: fetchData,
    };
};

export default useFetchDataReservas;
