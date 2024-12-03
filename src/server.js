require('dotenv').config(); // Carga las variables de entorno desde el archivo .env
const express = require('express'); // Framework para construir aplicaciones web y APIs
const cors = require('cors'); // Middleware para permitir solicitudes de recursos cruzados

const morgan = require('morgan'); // Middleware para el registro de solicitudes HTTP
const logger = require('./middleware/logger'); // Middleware personalizado para registrar solicitudes en Redis

const { mongoose, redisClient } = require('./config/db'); 

const productoRoutes = require('./routes/rutasProductos'); 
const usuariosRoutes = require('./routes/rutasUsuarios'); 

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(logger);

// Usamos las rutas importadas
app.use('/api/productos', productoRoutes);
app.use('/api/usuarios', usuariosRoutes);


// Definimos el puerto en el que la aplicación escuchará las solicitudes
const PORT = process.env.PORT || 3000;
// Iniciamos el servidor y lo ponemos a escuchar en el puerto definido
app.listen(PORT, () => {
console.log(`Servidor corriendo en puerto ${PORT}`);
});