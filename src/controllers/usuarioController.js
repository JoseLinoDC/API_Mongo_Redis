const Usuario = require('../models/usuarios');

// Obtener todos los usuarios o filtrados por criterios
exports.obtenerUsuarios = async (req, res) => {
    try {
      // Seleccionar solo los campos básicos
      const usuarios = await Usuario.find().select("nombre email telefono direccion_envio");
  
      res.status(200).json(usuarios);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      res.status(500).json({ mensaje: "Error al obtener los usuarios", error: error.message });
    }
  };
  
// Obtener un usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).populate('carrito.productos.producto_id pedidos.productos.producto_id comentarios.producto_id');
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el usuario', error });
  }
};

// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
    try {
      const {
        nombre,
        email,
        contraseña,
        direccion_envio,
        telefono,
        carrito,
        pedidos,
        comentarios
      } = req.body;
  
      // Crear un nuevo usuario con todos los datos del esquema
      const nuevoUsuario = new Usuario({
        nombre,
        email,
        contraseña,
        direccion_envio,
        telefono,
        carrito: carrito || { productos: [] }, // Si no hay carrito, inicializar vacío
        pedidos: pedidos || [], // Si no hay pedidos, inicializar vacío
        comentarios: comentarios || [] // Si no hay comentarios, inicializar vacío
      });
  
      // Guardar el usuario en la base de datos
      const usuarioGuardado = await nuevoUsuario.save();
  
      res.status(201).json({
        mensaje: "Usuario creado exitosamente",
        usuario: usuarioGuardado
      });
    } catch (error) {
      console.error("Error al crear el usuario:", error);
  
      // Manejo detallado de errores
      res.status(400).json({
        mensaje: "Error al crear el usuario",
        error: error.message,
        detalles: error.errors || null // Detalles adicionales si están disponibles
      });
    }
  };

// Actualizar un usuario
exports.actualizarUsuario = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nombre,
        email,
        contraseña,
        direccion_envio,
        telefono,
        carrito,
        pedidos,
        comentarios
      } = req.body;
  
      // Buscar el usuario por ID
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
  
      // Actualizar campos principales
      if (nombre !== undefined) usuario.nombre = nombre;
      if (email !== undefined) usuario.email = email;
      if (contraseña !== undefined) usuario.contraseña = contraseña;
      if (direccion_envio !== undefined) usuario.direccion_envio = direccion_envio;
      if (telefono !== undefined) usuario.telefono = telefono;
  
      // Actualizar carrito (sobrescribir si se envía uno nuevo)
      if (carrito && carrito.productos) {
        usuario.carrito.productos = carrito.productos;
      }
  
      // Actualizar pedidos (sobrescribir si se envía uno nuevo)
      if (pedidos) {
        usuario.pedidos = pedidos;
      }
  
      // Actualizar comentarios (sobrescribir si se envían nuevos comentarios)
      if (comentarios) {
        usuario.comentarios = comentarios;
      }
  
      // Guardar los cambios en la base de datos
      const usuarioActualizado = await usuario.save();
  
      res.status(200).json({
        mensaje: "Usuario actualizado exitosamente",
        usuario: usuarioActualizado
      });
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
  
      res.status(400).json({
        mensaje: "Error al actualizar el usuario",
        error: error.message
      });
    }
  };
  

// Eliminar un usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el usuario', error });
  }
};

//Q3: Listar los productos de una marca específica y los clientes que los han agregado a su carrito
exports.obtenerProductosYClientesPorMarca = async (req, res) => {
    try {
      const { marca } = req.params;
  
      // Buscar usuarios cuyo carrito contiene productos y hacer populate para obtener detalles del producto
      const usuarios = await Usuario.find({
        'carrito.productos.producto_id': { $exists: true }
      }).populate('carrito.productos.producto_id', 'marca modelo'); // Solo traemos marca y modelo del producto
  
      // Filtrar y estructurar los datos
      const resultado = usuarios
        .map(usuario => {
          // Filtrar los productos del carrito que coinciden con la marca
          const productosCarrito = usuario.carrito.productos
            .filter(producto => producto.producto_id && producto.producto_id.marca === marca)
            .map(producto => ({
              marca: producto.producto_id.marca,
              modelo: producto.producto_id.modelo
            }));
  
          // Solo incluir usuarios con productos que coincidan
          if (productosCarrito.length > 0) {
            return {
              _id: usuario._id,
              nombre: usuario.nombre,
              email: usuario.email,
              productos_carrito: productosCarrito
            };
          }
        })
        .filter(usuario => usuario); // Eliminar usuarios sin productos que coincidan
  
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener los productos y clientes por marca', error });
    }
  };
  
  

  //Q4: Listar los productos que ha agregado un cliente en específico a su carrito de compras
  exports.obtenerCarritoDeCliente = async (req, res) => {
    try {
      const { idCliente } = req.params;
      const usuario = await Usuario.findById(idCliente).populate('carrito.productos.producto_id');
      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      res.status(200).json(usuario.carrito.productos);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener el carrito del cliente', error });
    }
  };

  
  //Q7: Listar todos los pedidos (incluyendo los productos) de un cliente en específico
  exports.obtenerPedidosDeCliente = async (req, res) => {
    try {
      const { idCliente } = req.params;
      const usuario = await Usuario.findById(idCliente).populate('pedidos.productos.producto_id');
      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      res.status(200).json(usuario.pedidos);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener los pedidos del cliente', error });
    }
  };
  
  //Q8: Listar todos los productos que ha adquirido un cliente en específico
  exports.obtenerProductosAdquiridosPorCliente = async (req, res) => {
    try {
      const { idCliente } = req.params;
  
      // Buscar al usuario por ID y hacer populate de los productos en los pedidos
      const usuario = await Usuario.findById(idCliente).populate('pedidos.productos.producto_id');
  
      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
  
      // Extraer y mapear los productos adquiridos
      const productosAdquiridos = usuario.pedidos.flatMap(pedido =>
        pedido.productos.map(producto => ({
          subcategoria: producto.producto_id.subcategoria,
          descripcion: producto.producto_id.descripcion,
          precio: producto.producto_id.precio
        }))
      );
  
      // Formatear el resultado final
      const resultado = {
        _id: usuario._id,
        nombre: usuario.nombre,
        productos_adquiridos: productosAdquiridos
      };
  
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener los productos adquiridos', error });
    }
  };
  

  
  //Q9: Listar todos los Clientes que han comprado un producto en específico
  exports.obtenerClientesPorProducto = async (req, res) => {
    try {
      const { idProducto } = req.params;
      const usuarios = await Usuario.find({ 'pedidos.productos.producto_id': idProducto }).select('nombre email');
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener los clientes por producto', error });
    }
  };
  