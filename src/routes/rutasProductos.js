const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');


router.get('/all', productosController.obtenerProductos);
router.get('/all/mas-agregados', productosController.obtenerProductosMasAgregados); //Q6
router.get('/:id', productosController.obtenerProductoPorId);
router.post('/', productosController.crearProducto);
router.put('/:id', productosController.actualizarProducto);
router.delete('/:id', productosController.eliminarProducto);

router.get('/categoria/:categoria', productosController.obtenerProductosPorCategoria); // Q1
router.get('/marca/:marca', productosController.obtenerProductosPorMarca); // Q2
router.get('/valoraciones/mejores', productosController.obtenerProductosMejorValorados); // Q5

module.exports = router;
