import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// Librerías de terceros
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Button, Modal, Box, MenuItem, Select, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { TableSortLabel } from '@mui/material';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
// Importaciones locales
import useFetchDataReservas from '../hooks/useFetchDataReservas.jsx';

export default function misReservas() {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        reservas,
        isLoading,
        error,
        totalCount,
        page,
        rowsPerPage,
        orderDirection,
        valueToOrderBy,
        handleSearchChange,
        handleChangePage,
        handleChangeRowsPerPage,
        createSortHandler
    } = useFetchDataReservas();

    if (isLoading) {
        return <CircularProgress />; // Mostrar indicador de carga mientras los datos se obtienen
    }
    if (error) {
        return <div>Error al cargar las reservas: {error}</div>; // Mostrar mensaje de error si ocurre
    }
    console.log(reservas)
    return (
        <div>
            <span className='breadcrum'>
                <svg style={{ cursor: 'pointer' }} onClick={() => navigate('/')} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" fillOpacity=".25" d="M5 14.059c0-1.01 0-1.514.222-1.945c.221-.43.632-.724 1.453-1.31l4.163-2.974c.56-.4.842-.601 1.162-.601c.32 0 .601.2 1.162.601l4.163 2.973c.821.587 1.232.88 1.453 1.311c.222.43.222.935.222 1.944V19c0 .943 0 1.414-.293 1.707C18.414 21 17.943 21 17 21H7c-.943 0-1.414 0-1.707-.293C5 20.414 5 19.943 5 19z" /><path fill="currentColor" d="M3 12.387c0 .266 0 .4.084.441c.084.041.19-.04.4-.205l7.288-5.668c.59-.459.885-.688 1.228-.688c.343 0 .638.23 1.228.688l7.288 5.668c.21.164.316.246.4.205c.084-.041.084-.175.084-.441v-.409c0-.48 0-.72-.102-.928c-.101-.208-.291-.356-.67-.65l-7-5.445c-.59-.459-.885-.688-1.228-.688c-.343 0-.638.23-1.228.688l-7 5.445c-.379.294-.569.442-.67.65c-.102.208-.102.448-.102.928zM12.5 15h-1a2 2 0 0 0-2 2v3.85c0 .083.067.15.15.15h4.7a.15.15 0 0 0 .15-.15V17a2 2 0 0 0-2-2" /><rect width="2" height="4" x="16" y="5" fill="currentColor" rx=".5" /></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m14.475 12l-7.35-7.35q-.375-.375-.363-.888t.388-.887q.375-.375.888-.375t.887.375l7.675 7.7q.3.3.45.675t.15.75q0 .375-.15.75t-.45.675l-7.7 7.7q-.375.375-.875.363T7.15 21.1q-.375-.375-.375-.888t.375-.887z" /></svg>
                <span onClick={() => navigate('/app/reservas')}>Reservas</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m14.475 12l-7.35-7.35q-.375-.375-.363-.888t.388-.887q.375-.375.888-.375t.887.375l7.675 7.7q.3.3.45.675t.15.75q0 .375-.15.75t-.45.675l-7.7 7.7q-.375.375-.875.363T7.15 21.1q-.375-.375-.375-.888t.375-.887z" /></svg>
                <span>Mis reservas</span>
            </span>
            <div className="seccion bg-white  p-2 rounded-lg justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="justify-between items-center font-semibold text-2xl" style={{ color: '#18181b' }}><span style={{ color: '#104172' }}>M</span>is <span style={{ color: '#104172' }}>R</span>eservas</h1>
                    <small className='text-gray-600'>Sección para listar la información de las reservas realizadas</small>
                </div>
            </div>

            <TableContainer component={Paper} className="mt-6">
                <Table>
                    <TableHead className='text-sm'>
                        <tr>
                            <td className='p-3'>
                                <TableSortLabel
                                    active={valueToOrderBy === 'origen'}
                                    direction={valueToOrderBy === 'origen' ? orderDirection : 'asc'}
                                    onClick={() => createSortHandler('origen')}
                                >
                                    Origen
                                </TableSortLabel>
                            </td>
                            <td className='text-center'>
                                <TableSortLabel
                                    active={valueToOrderBy === 'destino'}
                                    direction={valueToOrderBy === 'destino' ? orderDirection : 'asc'}
                                    onClick={() => createSortHandler('destino')}
                                >
                                    Destino
                                </TableSortLabel>
                            </td>
                            <td className='text-center'>
                                <TableSortLabel
                                    active={valueToOrderBy === 'fecha'}
                                    direction={valueToOrderBy === 'fecha' ? orderDirection : 'asc'}
                                    onClick={() => createSortHandler('fecha')}
                                >
                                    Fecha
                                </TableSortLabel>
                            </td>

                        </tr>
                    </TableHead>

                    <TableBody>
                        {reservas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reserva) => (
                            <TableRow key={reserva.id}>
                                <TableCell>{reserva.origen}</TableCell>
                                <TableCell>{reserva.destino}</TableCell>
                                <TableCell>{reserva.created_at}</TableCell>
                             
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

        </div>
    )
}
