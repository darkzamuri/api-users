api-users

Requisitos

Node.js
npm
Instalación
Clona este repositorio en tu máquina local.
Abre una terminal y navega hasta el directorio del proyecto.
Ejecuta el comando npm install para instalar las dependencias.
npm i
npm start

documentacion de endpoints
* Listado de todos los usuarios (con paginación)  GET /api/v1/users?page=1&count=10  
* Obtener un solo usuario GET /api/v1/users/{ID} 
* Actualizar un usuario UPDATE /api/v1/users/{ID}
* Eliminar un usuario DELETE /api/v1/users/{ID}
