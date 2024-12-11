import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import '../utils/Sidebar.css'
import Logo from '../../../../assets/logo.svg'
export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeItem, setActiveItem] = useState('');
    const [isCollapsed, setCollapsed] = useState(false);
    const [isRecepcionOpen, setIsRecepcionOpen] = useState(false);
    const [isSeguimientoOpen, setIsSeguimientoOpen] = useState(false);

    useEffect(() => {
        setActiveItem(location.pathname);
    }, [location.pathname]);

    const handleLogout = async () => {
        localStorage.removeItem('access_token');
        localStorage.setItem('closed_session', 'true');
        navigate('/');
    };
    const toggleCollapse = () => {
        setCollapsed(!isCollapsed);
    };

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
        "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    const dia = hoy.getDate();
    const mes = hoy.getMonth();
    const ano = hoy.getFullYear();
    const fecha = `${meses[mes]} ${dia}, ${ano}`;

    return (
        <>

            <div className="navigation">
                <div className="navb text-right justify-end flex flex-row mb-7">
                    <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeDasharray="16" strokeDashoffset="16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M5 5h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0" /></path><path d="M5 12h14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="16;0" /></path><path d="M5 19h14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="16;0" /></path></g></svg>
                    <div className="flex flex-row">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M6.96 2c.418 0 .756.31.756.692V4.09c.67-.012 1.422-.012 2.268-.012h4.032c.846 0 1.597 0 2.268.012V2.692c0-.382.338-.692.756-.692s.756.31.756.692V4.15c1.45.106 2.403.368 3.103 1.008c.7.641.985 1.513 1.101 2.842v1H2V8c.116-1.329.401-2.2 1.101-2.842c.7-.64 1.652-.902 3.103-1.008V2.692c0-.382.339-.692.756-.692" /><path fill="currentColor" d="M22 14v-2c0-.839-.013-2.335-.026-3H2.006c-.013.665 0 2.161 0 3v2c0 3.771 0 5.657 1.17 6.828C4.349 22 6.234 22 10.004 22h4c3.77 0 5.654 0 6.826-1.172S22 17.771 22 14" opacity=".5" /><path fill="currentColor" fillRule="evenodd" d="M14 12.25A1.75 1.75 0 0 0 12.25 14v2a1.75 1.75 0 1 0 3.5 0v-2A1.75 1.75 0 0 0 14 12.25m0 1.5a.25.25 0 0 0-.25.25v2a.25.25 0 1 0 .5 0v-2a.25.25 0 0 0-.25-.25" clipRule="evenodd" /><path fill="currentColor" d="M11.25 13a.75.75 0 0 0-1.28-.53l-1.5 1.5a.75.75 0 0 0 1.06 1.06l.22-.22V17a.75.75 0 0 0 1.5 0z" /></svg>
                        <h5 className="mx-5 fecha">{fecha}</h5>
                    </div>

                    <h3 className="mr-3">Valeria Carmona Suárez</h3>
                </div>

                <div className="flex flex-row justify-center items-center">
                    <img className="mt-2" src={Logo} alt="" />
                </div>


                <ul className="ml-4 mt-8">
                    <small className="seccion_titulo">General</small>
                   
                    <li className="list cursor-pointer" onClick={() => navigate('/app/usuarios')}>
                        <a>
                            <svg className="ic" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19.128a9.38 9.38 0 0 0 2.625.372a9.337 9.337 0 0 0 4.121-.952a4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0a3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0a2.625 2.625 0 0 1 5.25 0Z" /></svg>
                            <span className="title">Usuarios</span>
                        </a>
                    </li>
                    <li className="list cursor-pointer" onClick={() => navigate('/app/reservas')}>
                        <a>
                            <svg className="ic" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M11 21H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3.5M16 3v4M8 3v4m-4 4h11" /><path d="m17.8 20.817l-2.172 1.138a.392.392 0 0 1-.568-.41l.415-2.411l-1.757-1.707a.389.389 0 0 1 .217-.665l2.428-.352l1.086-2.193a.392.392 0 0 1 .702 0l1.086 2.193l2.428.352a.39.39 0 0 1 .217.665l-1.757 1.707l.414 2.41a.39.39 0 0 1-.567.411z" /></g></svg>
                            <span className="title">Reservas</span>
                        </a>
                    </li>
                    <li className="list cursor-pointer" onClick={handleLogout}>
                        <a>
                            <svg className="ic" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="m7.85 13l2.85 2.85q.3.3.288.7t-.288.7q-.3.3-.712.313t-.713-.288L4.7 12.7q-.3-.3-.3-.7t.3-.7l4.575-4.575q.3-.3.713-.287t.712.312q.275.3.288.7t-.288.7L7.85 11H19q.425 0 .713.288T20 12t-.288.713T19 13z"/></svg>
                            <span className="title">Salir</span>
                        </a>
                    </li>
                    
                    
                    
                </ul>
              
            </div>

            <div className="content">
                <div className="app-content">
                    <div className="projects-section">
                        <div className="seccion_conten bg-white rounded-lg">
                            <Toaster />
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>

        </>

    )
}
