# TravelFlight UI

Este proyecto es una interfaz de usuario desarrollada con React, Vite y Tailwind CSS. Está diseñado para manejar módulos de aeropuertos, reservas, usuarios y más.

## 🚀 Requisitos previos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas:

1. [Node.js](https://nodejs.org/) (v14 o superior recomendado).
2. [npm](https://www.npmjs.com/) o [Yarn](https://yarnpkg.com/) para gestionar paquetes.
3. Un editor de código como [Visual Studio Code](https://code.visualstudio.com/).

## 📂 Estructura del proyecto

El proyecto sigue la siguiente estructura de carpetas:
travelflight_ui/ ├── node_modules/ ├── public/ ├── src/ │ ├── assets/ # Archivos estáticos como imágenes │ ├── modules/ # Módulos organizados por funcionalidades │ │ ├── aeropuertos/ │ │ │ ├── components/ # Componentes específicos del módulo │ │ │ ├── hooks/ # Hooks personalizados │ │ │ ├── core/ # Lógica central del módulo │ │ ├── reservas/ │ │ ├── usuarios/ │ ├── services/ # Archivos para llamadas a APIs │ ├── api.js # Archivo principal para las conexiones con la API ├── .gitignore ├── index.html # Archivo HTML principal ├── package.json # Dependencias y configuración del proyecto ├── tailwind.config.js # Configuración de Tailwind CSS ├── vite.config.js # Configuración de Vite

## 🔧 Configuración del proyecto

### Clonar el repositorio

Clona este repositorio en tu máquina local usando el siguiente comando:

```bash
git clone <URL-del-repositorio>
```

### Instalar dependencias

cd travelflight_ui
npm install

### Configurar Tailwind

```bash
module.exports = {
  content: ['./index.html', './src/**/*.{jsx,js,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Ejecutar proyecto
npm run dev