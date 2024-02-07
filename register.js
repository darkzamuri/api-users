const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Configurar bodyParser para manejar solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Establecer EJS como motor de plantillas
app.set('view engine', 'ejs');

let users = [];

// Ruta para el formulario de registro
app.get('/register', (req, res) => {
    res.render('register');
});

// Endpoint para el registro de usuario
app.post('/register', (req, res) => {
    const { nombre, apellido, usuario, email, password } = req.body;

    // Verificar si el usuario o el correo electrónico ya existen
    const existingUser = users.find(user => user.usuario === usuario || user.email === email);
    if (existingUser) {
        return res.render('register', { mensaje: 'El usuario o correo electrónico ya existe.' });
    }

    // Encriptar la contraseña antes de guardarla
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crear un nuevo usuario
    const newUser = {
        id: uuidv4(),
        nombre,
        apellido,
        usuario,
        email,
        password: hashedPassword
    };

    // Guardar el nuevo usuario
    users.push(newUser);

    res.render('register', { mensaje: 'Usuario registrado exitosamente.' });
});

// Otras rutas y endpoints aquí...

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor NodeJS iniciado en el puerto 3000');
});
