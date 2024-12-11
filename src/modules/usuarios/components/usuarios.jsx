import React, { useEffect, useState } from 'react'
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
// Hooks de funcionalidades
import useFetchData from '../hooks/useFetchData.jsx'
import { useCreateData } from '../hooks/useCreateData.jsx';
import { useUpdateData } from '../hooks/useUpdateData.jsx';
import { useDisableStatus } from '../hooks/useDisableStatus.jsx';
import { useValidation } from '../../Core/Validation/hooks/useValidation.jsx';
import { useDeleteData } from '../hooks/useDeleteData.jsx';

export default function Usuarios() {
    const validations = {
        nombre: (value) => {
            if (!value) return 'El nombre es obligatorio.';
            if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
            return null;
        },
        apellido: (value) => {
            if (!value) return 'El apellido es obligatorio.';
            if (value.length < 3) return 'El apellido debe tener al menos 3 caracteres.';
            return null;
        },
        correo: (value) => {
            if (!value) return 'El correo es obligatorio.';
            if (value.length < 3) return 'El correo debe tener al menos 3 caracteres.';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'El formato del correo no es válido.';
            return null;
        },
        password: (value) => {
            if (!modalData && !value) return 'La contraseña es obligatoria.'; // Solo obligatorio en modo creación
            if (value && value.length < 4) return 'La contraseña debe tener al menos 4 caracteres.';
            return null;
        },
    };

    const {
        usuarios,
        setUsuarios,
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
    } = useFetchData();

    const { handleClick } = useActionButton();

    const { createUsuario, isLoading: isCreating, error: createError } = useCreateData();
    const { updateUsuario } = useUpdateData();
    const { toggleStatus, isUpdating, updateError } = useDisableStatus();
    const { deleteUsuario, isDeleting, deleteError } = useDeleteData(); // Hook de eliminación

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', apellido: '', cedula: '', correo: '', password: '' }); // Formulario controlado
    const { errors, validate, validateAll, clearError } = useValidation(validations);

    const handleOpenModal = (data = null) => {
        setModalData(data);
        setFormData(data ? {
            nombre: data.nombre,
            apellido: data.apellido,
            cedula: data.cedula,
            correo: data.correo,
            password: data.password
        } : {
            nombre: '',
            apellido: '',
            cedula: '',
            correo: '',
            password: ''
        }); // Limpia o llena el formulario
        clearError('nombre', 'apellido', 'cedula', 'correo', 'password'); // Limpia el error de 'nombre' al abrir el modal
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData(null);
        setFormData({
            nombre: '',
            apellido: '',
            cedula: '',
            correo: '',
            password: ''
        });
    };
    const handleCreate = async () => {
        if (!validateAll(formData)) return;
        try {
            const newRecord = await createUsuario(formData); // Asegúrate de que el hook retorne los datos correctos
            console.log("si da")
            // Formatea el registro para que coincida con el formato existente en tiposListas
            // const formattedRecord = {
            //     ...newRecord,
            //     created_at: format(new Date(), "d 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: es }),
            //     updated_at: format(new Date(), "d 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: es }),
            // };

            setUsuarios((prev) => [...prev, newRecord]);

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
                // text: 'El tipo de lista ha sido creado.',
            });

            handleCloseModal(); // Cierra el modal
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `No se pudo crear: ${error.message}`,
                timer: 3000,
                showConfirmButton: false,
                toast: true,
                position: 'top-right',
            });
            
        }
    };

    const handleSave = async () => {
        if (!validateAll(formData)) return; // Si hay errores, no continúa
        try {
            if (modalData && modalData.id) {
                await updateUsuario(modalData.id, formData);

                // Actualiza el registro en el estado local
                setUsuarios((prev) =>
                    prev.map((item) =>
                        item.id === modalData.id
                            ? { ...item, ...formData }
                            : item
                    )
                );
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
                    title: "Datos actualizados correctamente",
                    // text: 'El tipo de lista ha sido creado.',
                });
            } else {
                console.log("aca fue")
                await handleCreate();

            }

            handleCloseModal();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `No se pudo completar la operación: ${error.message}`,
                timer: 3000,
                showConfirmButton: false,
                toast: true,
                position: 'top-right',
            });
        }
    };

    const handleUpdate = (usuario) => {
        handleOpenModal(usuario);
    };
    const handleToggleStatus = async (id, currentStatus) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¡El registro cambiará su estado!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00b388",
            cancelButtonColor: "#424242",
            confirmButtonText: "Sí, cambiar estado",
            cancelButtonText: "Cancelar"
        });
        if (result.isConfirmed) {
            try {
                const newStatus = await toggleStatus(id, currentStatus); // Cambia el estado en la API y obtiene el nuevo estado
                setUsuarios((prev) =>
                    prev.map((item) =>
                        item.id === id
                            ? {
                                ...item,
                                is_active: newStatus, // Actualiza el estado localmente
                                estadoVisual: {
                                    text: newStatus ? "Activo" : "Inactivo",
                                    style: newStatus ? "estado-label activo" : "estado-label inactivo",
                                },
                            }
                            : item
                    )
                );
                Swal.fire({
                    icon: "success",
                    title: "Estado actualizado",
                    text: `El estado se ha cambiado a ${newStatus ? "Activo" : "Inactivo"}.`,
                    timer: 3000,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-right",
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `No se pudo actualizar el estado: ${error.message}`,
                    timer: 3000,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-right",
                });
            }
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el registro permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await deleteUsuario(id);
                setUsuarios((prev) => prev.filter((item) => item.id !== id));
                Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
            } catch (error) {
                Swal.fire('Error', `No se pudo eliminar: ${error.message}`, 'error');
            }
        }
    };


    if (isLoading) return <p>Cargando tipos de listas...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <span className='breadcrum'>
                <svg style={{ cursor: 'pointer' }} onClick={() => navigate('/')} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" fillOpacity=".25" d="M5 14.059c0-1.01 0-1.514.222-1.945c.221-.43.632-.724 1.453-1.31l4.163-2.974c.56-.4.842-.601 1.162-.601c.32 0 .601.2 1.162.601l4.163 2.973c.821.587 1.232.88 1.453 1.311c.222.43.222.935.222 1.944V19c0 .943 0 1.414-.293 1.707C18.414 21 17.943 21 17 21H7c-.943 0-1.414 0-1.707-.293C5 20.414 5 19.943 5 19z" /><path fill="currentColor" d="M3 12.387c0 .266 0 .4.084.441c.084.041.19-.04.4-.205l7.288-5.668c.59-.459.885-.688 1.228-.688c.343 0 .638.23 1.228.688l7.288 5.668c.21.164.316.246.4.205c.084-.041.084-.175.084-.441v-.409c0-.48 0-.72-.102-.928c-.101-.208-.291-.356-.67-.65l-7-5.445c-.59-.459-.885-.688-1.228-.688c-.343 0-.638.23-1.228.688l-7 5.445c-.379.294-.569.442-.67.65c-.102.208-.102.448-.102.928zM12.5 15h-1a2 2 0 0 0-2 2v3.85c0 .083.067.15.15.15h4.7a.15.15 0 0 0 .15-.15V17a2 2 0 0 0-2-2" /><rect width="2" height="4" x="16" y="5" fill="currentColor" rx=".5" /></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m14.475 12l-7.35-7.35q-.375-.375-.363-.888t.388-.887q.375-.375.888-.375t.887.375l7.675 7.7q.3.3.45.675t.15.75q0 .375-.15.75t-.45.675l-7.7 7.7q-.375.375-.875.363T7.15 21.1q-.375-.375-.375-.888t.375-.887z" /></svg>
                <span>Usuarios</span>
            </span>
            <div className="seccion bg-white  p-2 rounded-lg justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="justify-between items-center font-semibold text-2xl" style={{ color: '#18181b' }}><span style={{ color: '#104172' }}>U</span>suarios</h1>
                    <small className='text-gray-600'>Sección para gestionar la información de los usuarios del aplicativo</small>
                </div>
                <div className="contenedor-tabla">
                    <div className="flex flex-row justify-between mb-4 mt-3">
                        <div className="relative rounded-md">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 pr-2" style={{ marginTop: '-5px' }}>
                                <span className="text-gray-500 sm:text-sm mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M10.77 18.3a7.53 7.53 0 1 1 7.53-7.53a7.53 7.53 0 0 1-7.53 7.53m0-13.55a6 6 0 1 0 6 6a6 6 0 0 0-6-6" /><path fill="currentColor" d="M20 20.75a.74.74 0 0 1-.53-.22l-4.13-4.13a.75.75 0 0 1 1.06-1.06l4.13 4.13a.75.75 0 0 1 0 1.06a.74.74 0 0 1-.53.22" /></svg>
                                </span>
                            </div>
                            <input
                                type="text"
                                autoComplete='off'
                                className="block w-72 rounded-md border-0 py-1.5 pl-8 pr-1 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                                placeholder="Buscar usuario"
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                        <div>
                            <ActionButton
                                text="Nuevo registro"
                                onClick={() => handleOpenModal()}
                                color="#104172"
                                textColor="#FFFFFF"
                                size="small"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m10-8a8 8 0 1 0 0 16a8 8 0 0 0 0-16" /><path d="M13 7a1 1 0 1 0-2 0v4H7a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 1 0 0-2h-4z" /></g></svg>}
                                handleClick={handleClick}
                                customStyles={{ fontWeight: '400' }}
                            />
                        </div>
                    </div>
                    <TableContainer component={Paper}>
                        <table className='w-full tabla-principal'>
                            <TableHead className='text-sm'>
                                <tr>
                                    <td className='p-3'>
                                        <TableSortLabel
                                            active={valueToOrderBy === 'nombre'}
                                            direction={valueToOrderBy === 'nombre' ? orderDirection : 'asc'}
                                            onClick={() => createSortHandler('nombre')}
                                        >
                                            Nombre completo
                                        </TableSortLabel>
                                    </td>
                                    <td className='p-3'>
                                        <TableSortLabel
                                            active={valueToOrderBy === 'cedula'}
                                            direction={valueToOrderBy === 'cedula' ? orderDirection : 'asc'}
                                            onClick={() => createSortHandler('cedula')}
                                        >
                                            Cédula
                                        </TableSortLabel>
                                    </td>
                                    <td className='text-center'>
                                        <TableSortLabel
                                            active={valueToOrderBy === 'correo'}
                                            direction={valueToOrderBy === 'correo' ? orderDirection : 'asc'}
                                            onClick={() => createSortHandler('correo')}
                                        >
                                            Correo
                                        </TableSortLabel>
                                    </td>
                                    
                                    <td>
                                        <TableSortLabel
                                            active={valueToOrderBy === 'created_at'}
                                            direction={valueToOrderBy === 'created_at' ? orderDirection : 'asc'}
                                            onClick={() => createSortHandler('created_at')}
                                        >
                                            Fecha de creación
                                        </TableSortLabel>
                                    </td>
                                    <td>
                                        <TableSortLabel
                                            active={valueToOrderBy === 'update_at'}
                                            direction={valueToOrderBy === 'update_at' ? orderDirection : 'asc'}
                                            onClick={() => createSortHandler('update_at')}
                                        >
                                            Fecha de actualización
                                        </TableSortLabel>
                                    </td>
                                    <td className='text-center'>
                                        Acciones
                                    </td>
                                </tr>
                            </TableHead>
                            <TableBody className='text-sm'>
                                {usuarios.map((usuario) => (
                                    <tr className='border-b-2 border-gray-200' key={usuario.id}>
                                        <td className='p-4 '>{usuario.nombre}  {usuario.apellido}</td>
                                        <td className='p-4 '>{usuario.cedula}</td>
                                        <td className='p-4 '>{usuario.correo}</td>
                                       
                                        <td>{usuario.created_at}</td>
                                        <td>{usuario.updated_at}</td>
                                        <td>
                                            <div className="flex flex-row justify-center">
                                                <ActionButton
                                                    text=""
                                                    onClick={() => handleUpdate(usuario)}
                                                    color="#2d68ac0"
                                                    textColor="#2d68ac"
                                                    size="small_icon"
                                                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3" /></g></svg>}
                                                    handleClick={handleClick}
                                                    customStyles={{ fontWeight: '400', marginRight: '10px' }}
                                                />
                                              
                                                <ActionButton
                                                    text=""
                                                    onClick={() => handleDelete(usuario.id)}
                                                    color="#ac2d2d0"
                                                    textColor="#ac2d2d"
                                                    size="small_icon"
                                                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4zm2 2h6V4H9zM6.074 8l.857 12H17.07l.857-12zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1" /></svg>}
                                                    handleClick={handleClick}
                                                    customStyles={{ fontWeight: '400' }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </TableBody>
                        </table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(e, newPage) => handleChangePage(newPage)}
                        onRowsPerPageChange={(e) => handleChangeRowsPerPage(parseInt(e.target.value, 10))}
                    />
                    <ModalForm
                        open={isModalOpen}
                        onClose={handleCloseModal}
                        title={modalData ? 'Editar usuario' : 'Nuevo usuario'}
                        onSubmit={handleSave}
                        actionButtonProps={{
                            text: modalData ? 'Actualizar' : 'Guardar',
                            onClick: handleSave,
                            color: '#104172',
                            textColor: '#FFFFFF',
                            size: 'small'
                        }}
                    >
                        <div className="flex flex-row">
                            <div className="flex flex-col w-full mr-4">
                                <label className='text-zinc-800 text-sm mt-7' htmlFor="">Nombre del usuario <span className='font-bold text-red-700'>*</span></label>
                                <input
                                    type="text"
                                    placeholder="Ingrese el nombre del usuario"
                                    className={`block w-full rounded-md border py-1.5 pl-2 pr-1 mt-1 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 ${errors.nombre ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                                        }`}
                                    value={formData.nombre}
                                    onChange={(e) => {
                                        setFormData({ ...formData, nombre: e.target.value });
                                        validate('nombre', e.target.value); // Valida campo individual
                                    }}
                                    onBlur={() => validate('nombre', formData.nombre)} // Valida al perder foco
                                />
                                {errors.nombre && <small className="text-red-500">{errors.nombre}</small>}
                            </div>
                            <div className="flex flex-col w-full">
                                <label className='text-zinc-800 text-sm mt-7' htmlFor="">Apellido del usuario <span className='font-bold text-red-700'>*</span></label>
                                <input
                                    type="text"
                                    placeholder="Ingrese el apellido del usuario"
                                    className={`block w-full rounded-md border py-1.5 pl-2 pr-1 mt-1 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 ${errors.apellido ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                                        }`}
                                    value={formData.apellido}
                                    onChange={(e) => {
                                        setFormData({ ...formData, apellido: e.target.value });
                                        validate('apellido', e.target.value); // Valida campo individual
                                    }}
                                    onBlur={() => validate('apellido', formData.apellido)} // Valida al perder foco
                                />
                                {errors.apellido && <small className="text-red-500">{errors.apellido}</small>}
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <div className="flex flex-col w-full">
                                <label className='text-zinc-800 text-sm mt-5' htmlFor="">Cédula <span className='font-bold text-red-700'>*</span></label>
                                <input
                                    type="text"
                                    placeholder="Ingrese la cédula del usuario"
                                    className={`block w-full rounded-md border py-1.5 pl-2 pr-1 mt-1 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 ${errors.correo ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                                        }`}
                                    value={formData.cedula}
                                    onChange={(e) => {
                                        setFormData({ ...formData, cedula: e.target.value });
                                        validate('cedula', e.target.value); // Valida campo individual
                                    }}
                                    onBlur={() => validate('cedula', formData.cedula)} // Valida al perder foco
                                />
                                {errors.cedula && <small className="text-red-500">{errors.cedula}</small>}
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <div className="flex flex-col w-full">
                                <label className='text-zinc-800 text-sm mt-5' htmlFor="">Correo <span className='font-bold text-red-700'>*</span></label>
                                <input
                                    type="text"
                                    placeholder="Ingrese el correo del usuario"
                                    className={`block w-full rounded-md border py-1.5 pl-2 pr-1 mt-1 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 ${errors.correo ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                                        }`}
                                    value={formData.correo}
                                    onChange={(e) => {
                                        setFormData({ ...formData, correo: e.target.value });
                                        validate('correo', e.target.value); // Valida campo individual
                                    }}
                                    onBlur={() => validate('correo', formData.correo)} // Valida al perder foco
                                />
                                {errors.correo && <small className="text-red-500">{errors.correo}</small>}
                            </div>
                        </div>

                        <div className="flex flex-row">
                            {!modalData && (
                                <div className="flex flex-col w-full">
                                    <label className="text-zinc-800 text-sm mt-4" htmlFor="">
                                        Contraseña <span className="font-bold text-red-700">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Ingrese la contraseña del usuario"
                                        className={`block w-full rounded-md border py-1.5 pl-2 pr-1 mt-1 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                                            }`}
                                        value={formData.password}
                                        onChange={(e) => {
                                            setFormData({ ...formData, password: e.target.value });
                                            validate('password', e.target.value); // Valida campo individual
                                        }}
                                        onBlur={() => validate('password', formData.password)} // Valida al perder foco
                                    />
                                    {errors.password && <small className="text-red-500">{errors.password}</small>}
                                </div>
                            )}
                        </div>
                    </ModalForm>
                </div>
            </div>
        </div>
    )
}
