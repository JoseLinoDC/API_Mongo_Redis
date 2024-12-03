const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarioController');


router.get('/all', usuariosController.obtenerUsuarios);
router.get('/:id', usuariosController.obtenerUsuarioPorId);
router.post('/', usuariosController.crearUsuario);
router.put('/:id', usuariosController.actualizarUsuario);
router.delete('/:id', usuariosController.eliminarUsuario);


router.get('/marca/:marca', usuariosController.obtenerProductosYClientesPorMarca); // Q3
router.get('/:idCliente/carrito', usuariosController.obtenerCarritoDeCliente); // Q4
router.get('/:idCliente/pedidos', usuariosController.obtenerPedidosDeCliente); // Q7
router.get('/:idCliente/adquiridos', usuariosController.obtenerProductosAdquiridosPorCliente); // Q8
router.get('/producto/:idProducto/clientes', usuariosController.obtenerClientesPorProducto); // Q9

module.exports = router;
