    const mongoose = require('mongoose'); // Módulo para interactuar con MongoDB
    const redis = require('redis'); // Módulo para interactuar con Redis
    require('dotenv').config(); // Cargar variables de entorno desde un archivo .env
    // Conexión a MongoDB

    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true, // Uso del nuevo parser
        useUnifiedTopology: true, // Soporte para monitoreo del driver
        replicaSet: 'replica01', // Nombre del replica set
    })
        .then(() => {
            console.log('Conectado a MongoDB'); // Mensaje de éxito en la conexión
        })
        .catch((error) => {
            console.error('Error al conectar a MongoDB:', error); // Mensaje de error en la conexión
        });
    

    // Configuración de Redis
    const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
    });

    redisClient.on('connect', () => {
    console.log('Conectado a Redis');
    });

    redisClient.on('error', (err) => {
    console.error('Error en la conexión a Redis:', err);
    });

    // Exportamos las instancias de mongoose y redisClient para usarlas en otras partes de la aplicación
    module.exports = { mongoose, redisClient };