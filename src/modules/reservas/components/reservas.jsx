import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// Librerías de terceros
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Button, Modal, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { TableSortLabel } from '@mui/material';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
// Importaciones locales
import { useActionButton } from '../../Core/ActionButton/hooks/useActionButton.jsx';
import ActionButton from '../../Core/ActionButton/components/ActionButton.jsx';
import ModalForm from '../../Core/ModalForm/components/ModalForm.jsx';
import { useFetchData } from '../../aeropuertos/hooks/useFetchData.jsx'
import { useSearchFlights } from '../hooks/useSearchFlights.jsx';
import { useAirlineImageUrl } from '../hooks/useAirlineImageUrl.jsx';
import { useCreateData } from '../hooks/useCreateData.jsx';

export default function Reservas() {
    const navigate = useNavigate();
    // Estado para controlar el valor del campo "origen"
    const [origen, setOrigen] = useState('');
    const [destino, setDestino] = useState('');

    // Estado para almacenar los resultados de la búsqueda
    const [resultadosOrigen, setResultadosOrigen] = useState([]);
    const [resultadosDestino, setResultadosDestino] = useState([]);

    const [errorBusquedaOrigen, setErrorBusquedaOrigen] = useState(null);
    const [errorBusquedaDestino, setErrorBusquedaDestino] = useState(null);
    const isLoadingOrigen = useRef(false);
    const isLoadingDestino = useRef(false);

    const [origenIATA, setOrigenIATA] = useState('');
    const [destinoIATA, setDestinoIATA] = useState('');

    const [fecha, setFecha] = useState('');
    const [qtyPassengers, setQtyPassengers] = useState('');

    const { searchFlights, isLoading, error, results } = useSearchFlights();
    const isUserTypingOrigen = useRef(false);
    const isUserTypingDestino = useRef(false);

    const { consultarAeropuerto, isLoading: isCreating, error: createError } = useFetchData();

    const { createReserva, error: createErrorReserva } = useCreateData();
    const [formData, setFormData] = useState({ origen: '', destino: '', fecha: ''}); // Formulario controlado

    const { handleClick } = useActionButton();

    // Función para buscar aeropuertos para "Origen"
    const fetchAeropuertoOrigen = async () => {
        if (!isUserTypingOrigen.current || origen.length < 3) {
            setResultadosOrigen([]);
            return;
        }
        try {
            isLoadingOrigen.current = true;
            const response = await consultarAeropuerto(origen);

            if (response) {
                setResultadosOrigen(response);
                setErrorBusquedaOrigen(null);
            } else {
                setResultadosOrigen([]);
                setErrorBusquedaOrigen('No se encontraron resultados para tu búsqueda.');
            }
        } catch (error) {
            setErrorBusquedaOrigen('No se pudieron cargar los resultados. Intente nuevamente.');
        } finally {
            isLoadingOrigen.current = false;
        }
    };

    // Función para buscar aeropuertos para "Destino"
    const fetchAeropuertoDestino = async () => {
        if (!isUserTypingDestino.current || destino.length < 3) {
            setResultadosDestino([]);
            return;
        }

        try {
            isLoadingDestino.current = true;
            const response = await consultarAeropuerto(destino);

            if (response) {
                setResultadosDestino(response);
                setErrorBusquedaDestino(null);
            } else {
                setResultadosDestino([]);
                setErrorBusquedaDestino('No se encontraron resultados para tu búsqueda.');
            }
        } catch (error) {
            setErrorBusquedaDestino('No se pudieron cargar los resultados. Intente nuevamente.');
        } finally {
            isLoadingDestino.current = false;
        }
    };

    // useEffect para manejar el debounce en "Origen"
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchAeropuertoOrigen();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [origen]);

    // useEffect para manejar el debounce en "Destino"
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchAeropuertoDestino();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [destino]);

    const handleFocusOrigen = () => {
        isUserTypingOrigen.current = true;
    };

    const handleBlurOrigen = () => {
        isUserTypingOrigen.current = false;
    };

    const handleFocusDestino = () => {
        isUserTypingDestino.current = true;
    };

    const handleBlurDestino = () => {
        isUserTypingDestino.current = false;
    };

    // Manejadores para seleccionar el aeropuerto
    const handleSelectOrigen = (aeropuerto) => {
        setOrigen(`${aeropuerto.nombre} (${aeropuerto.codigoIATA})`);
        setOrigenIATA(aeropuerto.codigoIATA); // Actualiza el estado con el código IATA seleccionado
        setResultadosOrigen([]); // Limpia los resultados
    };

    const handleSelectDestino = (aeropuerto) => {
        setDestino(`${aeropuerto.nombre} (${aeropuerto.codigoIATA})`);
        setDestinoIATA(aeropuerto.codigoIATA); // Actualiza el estado con el código IATA seleccionado
        setResultadosDestino([]); // Limpia los resultados
    };

    const handleSearch = () => {
        const payload = {
            direct: false,
            currency: 'COP',
            searchs: 50,
            class: false,
            qtyPassengers: qtyPassengers,
            adult: 1,
            child: 0,
            baby: 0,
            seat: 0,
            itinerary: [
                {
                    departureCity: origenIATA, // Se usa el código IATA
                    arrivalCity: destinoIATA, // Se usa el código IATA
                    hour: new Date(fecha).toISOString(),
                },
            ],
        };
        console.log(payload)

        searchFlights(payload);
    };


    const handleCreate = async () => {
        // Establecer los datos del formulario antes de realizar la petición
        const formData = {
            origen: origen,
            destino: destino,
            fecha: fecha,
        };
    
        try {
            // Pasa formData directamente a la función
            const newRecord = await createReserva(formData); 
    
            // Formatea el registro para que coincida con el formato existente en tiposListas
            const formattedRecord = {
                ...newRecord,
                created_at: format(new Date(), "d 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: es }),
                updated_at: format(new Date(), "d 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: es }),
            };
    
            // setRes((prev) => [...prev, formattedRecord]);
    
            const Toast = Swal.mixin({
                toast: true,
                position: "top-right",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
    
            Toast.fire({
                icon: "success",
                title: "Datos registrados correctamente",
            });
    
        } catch (error) {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-right",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
    
            Toast.fire({
                icon: "success",
                title: "Datos registrados correctamente",
            });
        }
    };
    

    return (
        <div>
            <span className='breadcrum'>
                <svg style={{ cursor: 'pointer' }} onClick={() => navigate('/')} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" fillOpacity=".25" d="M5 14.059c0-1.01 0-1.514.222-1.945c.221-.43.632-.724 1.453-1.31l4.163-2.974c.56-.4.842-.601 1.162-.601c.32 0 .601.2 1.162.601l4.163 2.973c.821.587 1.232.88 1.453 1.311c.222.43.222.935.222 1.944V19c0 .943 0 1.414-.293 1.707C18.414 21 17.943 21 17 21H7c-.943 0-1.414 0-1.707-.293C5 20.414 5 19.943 5 19z" /><path fill="currentColor" d="M3 12.387c0 .266 0 .4.084.441c.084.041.19-.04.4-.205l7.288-5.668c.59-.459.885-.688 1.228-.688c.343 0 .638.23 1.228.688l7.288 5.668c.21.164.316.246.4.205c.084-.041.084-.175.084-.441v-.409c0-.48 0-.72-.102-.928c-.101-.208-.291-.356-.67-.65l-7-5.445c-.59-.459-.885-.688-1.228-.688c-.343 0-.638.23-1.228.688l-7 5.445c-.379.294-.569.442-.67.65c-.102.208-.102.448-.102.928zM12.5 15h-1a2 2 0 0 0-2 2v3.85c0 .083.067.15.15.15h4.7a.15.15 0 0 0 .15-.15V17a2 2 0 0 0-2-2" /><rect width="2" height="4" x="16" y="5" fill="currentColor" rx=".5" /></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m14.475 12l-7.35-7.35q-.375-.375-.363-.888t.388-.887q.375-.375.888-.375t.887.375l7.675 7.7q.3.3.45.675t.15.75q0 .375-.15.75t-.45.675l-7.7 7.7q-.375.375-.875.363T7.15 21.1q-.375-.375-.375-.888t.375-.887z" /></svg>
                <span>Reservas</span>
            </span>
            <div className="seccion bg-white  p-2 rounded-lg justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="justify-between items-center font-semibold text-2xl" style={{ color: '#18181b' }}><span style={{ color: '#104172' }}>R</span>eservas</h1>
                    <small className='text-gray-600'>Sección para gestionar la información de las reservas del aplicativo</small>
                </div>
                <div className="contenedor mt-6">
                    <div className="flex justify-between">
                        <div className="flex flex-row items-center">
                            <div className="flex flex-row">
                                <svg style={{ color: '#104172' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64"><path fill="currentColor" d="M61.22 4.387C60.286 2.869 58.659 2 56.754 2c-1.108 0-2.248.292-3.388.867c-3.855 1.948-8.762 5.468-13.911 9.919l-10.446-1.161l1.893-1.894l-1.909-1.91l-3.422 3.421l-10.891-1.209l2.27-2.27l-1.911-1.911l-3.797 3.799l-7.97-.886c-1.968-.219-1.588 4.727.7 5.794l22.869 10.66c-4.408 4.925-10.354 12.196-12.55 17.771L4.262 41.876c-.678-.074-.548 1.625.239 1.992c5.061 2.358 7.717 3.597 9.113 4.248c.032.105.075.205.116.305c-1.924 2.323-3.005 4.085-2.614 4.473c.386.385 2.138-.69 4.451-2.608q.155.067.328.124l4.236 9.091c.368.788 2.068.915 1.993.239l-1.109-10.001c4.861-1.944 11.521-6.907 17.784-12.543l10.639 22.83c1.068 2.293 6.016 2.669 5.797.699l-.886-7.971l3.797-3.796l-1.911-1.911l-2.268 2.269l-1.209-10.892l3.419-3.418l-1.911-1.912l-1.891 1.892l-1.16-10.441c4.453-5.149 7.973-10.056 9.919-13.911c1.125-2.233 1.156-4.51.086-6.247M59.421 9.77c-2.676 5.302-8.707 13.08-16.521 20.892c-8.438 8.44-16.827 14.79-22.108 17.087l-.232-2.098c3.957-4.042 6.65-7.701 6.076-8.283c-.582-.578-4.242 2.117-8.285 6.075l-2.111-.235c2.303-5.28 8.667-13.675 17.1-22.108c7.813-7.812 15.59-13.843 20.891-16.521c.904-.455 1.76-.661 2.524-.661c2.73-.001 4.293 2.625 2.666 5.852" /><path fill="currentColor" d="m52.743 6.057l-3.295 2.047c1.505-.52 3.557.125 4.748 1.076l2.643-2.642c-1.09-.841-2.61-.981-4.096-.481m2.077 3.747c.95 1.191 1.595 3.243 1.075 4.747l2.047-3.295c.5-1.487.359-3.006-.48-4.095z" /></svg>
                                <span className='font-bold ml-4' style={{ color: '#104172' }}>Reserva tu vuelo</span>
                            </div>
                            <div className="flex items-center ml-8">
                                <div className="flex mr-8">
                                    <input type="radio" checked className='mr-1' name="" id="" />
                                    <label className='text-xs' htmlFor="">Solo ida</label>
                                </div>

                            </div>
                        </div>
                        <div className="flex">
                            <ActionButton
                                text="Mis reservas"
                                onClick={() => navigate('/app/mis-reservas')}
                                color="#104172"
                                textColor="#FFFFFF"
                                className='m-3 w-40 justify-center'
                                size="small"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M11 21H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3.5M16 3v4M8 3v4m-4 4h11" /><path d="m17.8 20.817l-2.172 1.138a.392.392 0 0 1-.568-.41l.415-2.411l-1.757-1.707a.389.389 0 0 1 .217-.665l2.428-.352l1.086-2.193a.392.392 0 0 1 .702 0l1.086 2.193l2.428.352a.39.39 0 0 1 .217.665l-1.757 1.707l.414 2.41a.39.39 0 0 1-.567.411z" /></g></svg>}
                                handleClick={handleClick}
                                customStyles={{ fontWeight: '400' }}

                            />
                        </div>

                    </div>
                    <div className="flex mt-2">
                        <div className="m-3 flex flex-col border-2 border-zinc-200 p-2 rounded-md">
                            <span className='text-sm text-zinc-500'>Origen</span>
                            <div className="flex">
                                <input
                                    name='origen'
                                    id='origen'
                                    type="text"
                                    autoComplete='off'
                                    className="block w-full  focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                                    value={origen}
                                    onChange={(e) => setOrigen(e.target.value)}
                                    onFocus={handleFocusOrigen}
                                    onBlur={handleBlurOrigen}
                                    placeholder="Ingresa el origen"
                                />
                                <svg style={{ color: '#104172' }} xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><circle cx="12" cy="9" r="2.5" fill="currentColor" fillOpacity="0"><animate fill="freeze" attributeName="fillOpacity" begin="0.7s" dur="0.15s" values="0;1" /></circle><path fill="none" stroke="currentColor" strokeDasharray="48" strokeDashoffset="48" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20.5c0 0 -6 -7 -6 -11.5c0 -3.31 2.69 -6 6 -6c3.31 0 6 2.69 6 6c0 4.5 -6 11.5 -6 11.5Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="48;0" /><animateTransform attributeName="transform" dur="3s" keyTimes="0;0.3;0.4;0.54;0.6;0.68;0.7;1" repeatCount="indefinite" type="rotate" values="0 12 20.5;0 12 20.5;-8 12 20.5;0 12 20.5;5 12 20.5;-2 12 20.5;0 12 20.5;0 12 20.5" /></path></svg>
                            </div>
                            {isCreating && (
                                <p className="text-blue-600 text-sm mt-2">Cargando resultados...</p>
                            )}

                            {errorBusquedaOrigen && <p className="text-red-500 text-sm mt-2">{errorBusquedaOrigen}</p>}
                            {resultadosOrigen.length > 0 && (
                                <ul>
                                    {resultadosOrigen.map((aeropuerto, index) => (
                                        <li
                                            key={index}
                                            className="p-2 cursor-pointer hover:bg-blue-100"
                                            onClick={() => handleSelectOrigen(aeropuerto)}
                                        >
                                            {`${aeropuerto.nombre} (${aeropuerto.codigoIATA})`}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="m-3 flex flex-col border-2 border-zinc-200 p-2 rounded-md">
                            <span className='text-sm text-zinc-500'>Destino</span>
                            <div className="flex">
                                <input
                                    type="text"
                                    className="block w-full  focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                                    value={destino}
                                    onChange={(e) => setDestino(e.target.value)}
                                    onFocus={handleFocusDestino}
                                    onBlur={handleBlurDestino}
                                    placeholder="Ingresa el destino"
                                />
                                <svg style={{ color: '#104172' }} xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><circle cx="12" cy="9" r="2.5" fill="currentColor" fillOpacity="0"><animate fill="freeze" attributeName="fillOpacity" begin="0.7s" dur="0.15s" values="0;1" /></circle><path fill="none" stroke="currentColor" strokeDasharray="48" strokeDashoffset="48" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20.5c0 0 -6 -7 -6 -11.5c0 -3.31 2.69 -6 6 -6c3.31 0 6 2.69 6 6c0 4.5 -6 11.5 -6 11.5Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="48;0" /><animateTransform attributeName="transform" dur="3s" keyTimes="0;0.3;0.4;0.54;0.6;0.68;0.7;1" repeatCount="indefinite" type="rotate" values="0 12 20.5;0 12 20.5;-8 12 20.5;0 12 20.5;5 12 20.5;-2 12 20.5;0 12 20.5;0 12 20.5" /></path></svg>

                            </div>
                            {isCreating && (
                                <p className="text-blue-600 text-sm mt-2">Cargando resultados...</p>
                            )}
                            {errorBusquedaDestino && <p className="text-red-500 text-sm mt-2">{errorBusquedaDestino}</p>}
                            {resultadosDestino.length > 0 && (
                                <ul>
                                    {resultadosDestino.map((aeropuerto, index) => (
                                        <li
                                            key={index}
                                            className="p-2 cursor-pointer hover:bg-blue-100"
                                            onClick={() => handleSelectDestino(aeropuerto)}
                                        >
                                            {`${aeropuerto.nombre} (${aeropuerto.codigoIATA})`}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="m-3 flex flex-col border-2 border-zinc-200 p-2 rounded-md">
                            <span className='text-sm text-zinc-500'>Fecha</span>
                            <input
                                type="datetime-local"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                className="block w-full  focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="m-3 flex flex-col border-2 border-zinc-200 p-2 rounded-lg">
                            <span className='text-sm text-zinc-500'>Pasajeros</span>
                            <input
                                type="number"
                                min="1"
                                value={qtyPassengers}
                                onChange={(e) => setQtyPassengers(parseInt(e.target.value, 10))}
                                className="block w-full  focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                            />
                        </div>

                        <ActionButton
                            text="Buscar"
                            onClick={() => handleSearch()}
                            color="#104172"
                            textColor="#FFFFFF"
                            className='m-3 w-36 justify-center'
                            size="small"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" /></svg>}
                            handleClick={handleClick}
                            customStyles={{ fontWeight: '400' }}
                            {...isLoading ? 'Buscando...' : 'Buscar'}
                        />
                    </div>
                </div>
                {/* Mensaje de carga */}
                {isLoading && <p className="text-blue-500">Buscando vuelos...</p>}

                {/* Mensaje de error */}
                {error && <p className="text-red-500">Error: {error}</p>}

                {/* Mostrar resultados de búsqueda */}
                {results && results.length > 0 ? (
                    <TableContainer component={Paper} className="mt-6">
                        <Table>
                            <TableBody>
                                {results.map((company, index) => {
                                    const imageUrl = `https://pics.avs.io/60/60/${company}.png`; // Se genera la URL directamente
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="flex flex-row">
                                                    <input type='radio'
                                                        value={company}
                                                        name="selectedCompany" // Mismo nombre para todos los inputs
                                                        className='mr-4' />
                                                    <img
                                                        src={imageUrl}
                                                        alt={`Logo de ${company}`}
                                                        onError={(e) => e.target.style.display = 'none'}
                                                        style={{ width: '60px', height: '60px' }}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-row">
                                                    <svg className='mr-3' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M22 10H2v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3zM7 8a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v4a1 1 0 0 1-1 1m10 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v4a1 1 0 0 1-1 1" opacity=".5" /><path fill="currentColor" d="M19 4h-1v3a1 1 0 0 1-2 0V4H8v3a1 1 0 0 1-2 0V4H5a3 3 0 0 0-3 3v3h20V7a3 3 0 0 0-3-3" /></svg>
                                                    <span>{fecha}</span>

                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <div className="flex">
                                                        <svg style={{ color: '#104172' }} className='mr-7' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill="currentColor" d="m5.109 5.56l-.765-.987C3.532 3.525 4.28 2 5.605 2c.323 0 .637.097.903.28l2.1 1.44a5.7 5.7 0 0 1 .91-.953c.524-.426 1.195-.772 1.985-.767c1.544.01 2.657 1.213 3.242 2.024c.573.792.115 1.777-.692 2.073l-2.232.818l-3.106 4.48c-.938 1.353-3.054.428-2.697-1.18l.312-1.407l-3.105.875A1.75 1.75 0 0 1 1 8V5.16c0-1.21 1.638-1.587 2.166-.497l.605 1.249zm.026-1.6L6.16 5.284l1.043-.275c.296-.077.57-.25.803-.489L5.942 3.104a.596.596 0 0 0-.807.857m4.002.74c-.38.575-.947 1.083-1.68 1.276l-3.83 1.008a.5.5 0 0 1-.577-.266L2.266 5.1c-.022-.046-.047-.062-.064-.07a.15.15 0 0 0-.093-.005a.15.15 0 0 0-.081.045c-.013.014-.028.04-.028.09V8a.75.75 0 0 0 .953.722l3.106-.875a1 1 0 0 1 1.248 1.18l-.313 1.407c-.12.535.586.844.899.393l3.196-4.61a.5.5 0 0 1 .239-.185l2.38-.873a.44.44 0 0 0 .27-.255a.3.3 0 0 0-.043-.294c-.562-.779-1.415-1.603-2.438-1.61c-.483-.003-.934.207-1.348.543S9.39 4.317 9.137 4.7M1.5 14a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1z" /></svg>
                                                        <span>Destino</span>
                                                        <svg style={{ color: '#104172' }} className='ml-7' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M11.5 7.489v-2.45c0-.58.79-.747 1.026-.218l1.423 3.198h-.99a.6.6 0 0 1-.238-.045zm4.09.53l-1.694-3.808C13.002 2.202 10 2.841 10 5.039v1.854l-1.5-.596v-1.54c0-1.738-2.259-2.414-3.213-.961l-1.91 2.908a2.304 2.304 0 0 0 1.039 3.39l3.503 1.464l-2.045 1.898c-1.627 1.511-.004 4.165 2.082 3.405l6.761-2.464l3.463 1.446A2.036 2.036 0 0 0 21 13.965v-1.23a4.715 4.715 0 0 0-4.715-4.716zM7 6.951c0 .22.134.417.338.498l4.83 1.919c.25.1.52.151.79.151h3.327a3.215 3.215 0 0 1 3.215 3.216v1.23c0 .382-.39.642-.742.494l-3.643-1.521a1 1 0 0 0-.728-.017l-6.944 2.53c-.55.2-.977-.498-.548-.896l2.614-2.426a1 1 0 0 0-.295-1.656L4.994 8.71a.804.804 0 0 1-.362-1.183l1.91-2.908A.25.25 0 0 1 7 4.756zM3 20.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75" /></svg>
                                                    </div>
                                                    <div className="flex">
                                                        <span className='mr-24'>{origenIATA}</span>
                                                        <span>{destinoIATA}</span>
                                                    </div>

                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <ActionButton
                                                        text="Reservar"
                                                        onClick={() => handleCreate()}
                                                        color="#104172"
                                                        textColor="#FFFFFF"
                                                        className='m-3 w-36 justify-center'
                                                        size="small"
                                                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M11 21H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3.5M16 3v4M8 3v4m-4 4h11" /><path d="m17.8 20.817l-2.172 1.138a.392.392 0 0 1-.568-.41l.415-2.411l-1.757-1.707a.389.389 0 0 1 .217-.665l2.428-.352l1.086-2.193a.392.392 0 0 1 .702 0l1.086 2.193l2.428.352a.39.39 0 0 1 .217.665l-1.757 1.707l.414 2.41a.39.39 0 0 1-.567.411z" /></g></svg>}
                                                        handleClick={handleClick}
                                                        customStyles={{ fontWeight: '400' }}

                                                    />
                                                </div>

                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    !isLoading && !error && <p className="text-gray-500 mt-4">No se encontraron aerolíneas</p>
                )}

            </div>
        </div >
    )
}
