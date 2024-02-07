// Importar los módulos necesarios
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const path = require('path'); // Agrega esta línea para importar el módulo path

// Crear la aplicación Express
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Configurar bodyParser para manejar solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Base de datos simulada (solo para fines de demostración)
let users = [];
// Ruta para el formulario de registro
// Ruta para el formulario de registro
app.get('/register', (req, res) => {
    res.render('register', { mensaje: null }); // Inicializar la variable mensaje como null
});


// Endpoint para registro de usuario
app.post('/api/v1/register', (req, res) => {
    const { nombre, apellido, usuario, email, contraseña } = req.body;

    // Verificar si el usuario o el correo electrónico ya existen
    const existingUser = users.find(user => user.usuario === usuario || user.email === email);
    if (contraseña.length < 8) {
        return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres.' });
    }
    if (existingUser) {
        return res.render('register', { mensaje: 'El usuario o correo electrónico ya existe.' });
    }

    // Encriptar la contraseña antes de guardarla
    const hashedPassword = bcrypt.hashSync(contraseña, 10);

    // Crear un nuevo usuario
    const newUser = {
        id: uuidv4(),
        nombre,
        apellido,
        usuario,
        email,
        contraseña: hashedPassword
    };

    // Guardar el nuevo usuario
    users.push(newUser);

    res.render('register', { mensaje: 'Usuario registrado exitosamente.' });
});

// Endpoint para iniciar sesión
app.post('/api/v1/login', (req, res) => {
    const { usuario_email, contraseña } = req.body;

    // Buscar al usuario por usuario o email
    const user = users.find(user => user.usuario === usuario_email || user.email === usuario_email);
    if (!user || !bcrypt.compareSync(contraseña, user.contraseña)) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    res.status(200).json({ mensaje: 'Inicio de sesión exitoso.' });
});

// Endpoint para actualizar información de usuario
app.put('/api/v1/users/:id', (req, res) => {
    const userId = req.params.id;
    const { nombre, apellido, usuario, email, contraseña } = req.body;

    // Buscar al usuario por ID
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // Actualizar la información del usuario
    users[userIndex] = {
        ...users[userIndex],
        nombre,
        apellido,
        usuario,
        email,
        contraseña
    };

    res.status(200).json({ mensaje: 'Información de usuario actualizada exitosamente.' });
});

// Endpoint para eliminar usuario
app.delete('/api/v1/users/:id', (req, res) => {
    const userId = req.params.id;

    // Filtrar usuarios, excluyendo al usuario con el ID proporcionado
    users = users.filter(user => user.id !== userId);

    res.status(200).json({ mensaje: 'Usuario eliminado exitosamente.' });
});

// Endpoint para obtener todos los usuarios (con paginación)
app.get('/api/v1/users', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const count = parseInt(req.query.count) || 10;

    // Paginar la lista de usuarios
    const startIndex = (page - 1) * count;
    const endIndex = page * count;

    const paginatedUsers = users.slice(startIndex, endIndex);

    res.status(200).json(paginatedUsers);
});

// Endpoint para obtener un solo usuario por ID
app.get('/api/v1/users/:id', (req, res) => {
    const userId = req.params.id;

    // Buscar al usuario por ID
    const user = users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    res.status(200).json(user);
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor NodeJS iniciado en el puerto 3000');
});
