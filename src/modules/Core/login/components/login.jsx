import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import useSessionNotifications from '../hooks/useSessionNotification';
import '../utils/Login.css'
import Logo from '../../../../assets/logo.svg'
// import logo from '../../../../assets/login.png'
const Login = () => {
  const { correo, password, errors, setCorreo, setPassword, handleLogin, logout  } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  //   useInteractiveBubble();
  useSessionNotifications();

  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster />
      <div className="w-full max-w-md bg-white p-5 rounded-md">
        {/* Header */}
        <div className="space-y-1 flex flex-col items-center mb-4">
          <img src={Logo} className='w-28 mb-5' alt="" />
          <div style={{color: '#1c1c1b'}} className="text-2xl font-bold text-center">
            Iniciar sesión
          </div>
          <span className='text-center text-zinc-500 text-sm'>
            Ingresa tus credenciales para acceder a tu cuenta
          </span>
        </div>
        {/* Contenido */}
        <div className="space-y-4">
          <form onSubmit={handleLogin}>
            <div className="space-y-2 mb-4">
              <label className='text-sm text-gray-500' htmlFor="correo">Correo</label>
              <input
                type="text"
                id="correo"
                name="correo"
                style={{marginTop: '1px', marginBottom: ''}}
                className="block w-full rounded-md border-0 py-1.5 pl-8 pr-1 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                placeholder="Ingrese su correo"
                value={correo}
                autoComplete='off'
                onChange={(e) => setCorreo(e.target.value)}
              />
              {errors.correo && <div className="error-message">{errors.correo.join(' ')}</div>}
            </div>
            <div className="space-y-2">
              <label className='text-sm text-gray-500' htmlFor="password">Contraseña</label>
              <div className="relative">
                <input
                  id="password"
                  style={{marginTop: '-8px'}}
                  className="block w-full rounded-md border-0 py-1.5 pl-8 pr-1 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M3 13c3.6-8 14.4-8 18 0" /><path d="M12 17a3 3 0 1 1 0-6a3 3 0 0 1 0 6" /></g></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill="currentColor" d="m10.12 10.827l4.026 4.027a.5.5 0 0 0 .708-.708l-13-13a.5.5 0 1 0-.708.708l3.23 3.23A6 6 0 0 0 3.2 6.182a6.7 6.7 0 0 0-1.117 1.982c-.021.061-.047.145-.047.145l-.018.062s-.076.497.355.611a.5.5 0 0 0 .611-.355l.001-.003l.008-.025l.035-.109a5.7 5.7 0 0 1 .945-1.674a5 5 0 0 1 1.124-1.014L6.675 7.38a2.5 2.5 0 1 0 3.446 3.446m-3.8-6.628l.854.854Q7.564 5 8 5c2.044 0 3.286.912 4.028 1.817a5.7 5.7 0 0 1 .945 1.674q.025.073.035.109l.008.025v.003l.001.001a.5.5 0 0 0 .966-.257v-.003l-.001-.004l-.004-.013a2 2 0 0 0-.06-.187a6.7 6.7 0 0 0-1.117-1.982C11.905 5.089 10.396 4 8.002 4c-.618 0-1.177.072-1.681.199" /></svg>}
                </button>
                {errors.password && <div className="error-message">{errors.password.join(' ')}</div>}
              </div>
            </div>
            <div className="flex flex-col space-y-4 mt-7">
              <button className="w-full sub" type="submit">Iniciar sesión</button>
              <div className="text-sm text-center text-gray-500 enlace">
                ¿Olvidaste tu contraseña? <a href="#" style={{color:'#104172'}} className="hover:underline">Recuperla</a>
              </div>
            </div>
          </form>

        </div>
        {/* Pie */}

      </div>
      {/* <div className="row">
        <div className="col-md-5 imagenes"></div>
        <div className="col-md-7 formulario">
          <div className="textos">
            <p className="Texto_normal">Hola,</p>
            <p className="Texto_negro">
              <span style={{ color: '#00A54C', fontWeight: '800' }}>B</span>ienvenid
              <span style={{ color: '#FFC20E', fontWeight: '800' }}>o</span> de  
              <span style={{ color: '#DB2239', fontWeight: '800' }}>n</span>uevo
            </p>
            <div className="login-container flex flex-col justify-center">
              <form className="login-form" onSubmit={handleLogin}>
                <div className={`input-group ${errors.email ? 'invalid' : ''}`}>
                  <label htmlFor="correo">Correo</label>
                  <input
                    type="text"
                    id="correo"
                    name="correo"
                    placeholder="Ingrese su correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                  {errors.correo && <div className="error-message">{errors.correo.join(' ')}</div>}
                </div>
                <div className={`input-group relative ${errors.password ? 'invalid' : ''}`}>
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    onClick={togglePasswordVisibility}
                    type="button"
                    style={{
                      position: 'absolute',
                      top: '53%',
                      right: '36px',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                    }}
                    className="text-gray-500"
                  >
               
                  </button>
                  {errors.password && <div className="error-message">{errors.password.join(' ')}</div>}
                  <small className="text_lost">¿Olvidaste tu contraseña?</small>
                </div>
                <button type="submit">Iniciar sesión</button>
              </form>
   
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Login;
