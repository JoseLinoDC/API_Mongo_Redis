const Producto = require('../models/productos');
const Usuario = require('../models/usuarios'); 

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
    try {
      const { filtro } = req.query; // Leer el parámetro de consulta "filtro"
  
      if (filtro === 'mas-agregados') {
        // Obtener productos más agregados
        const productos = await Usuario.aggregate([
          {
            $unwind: "$carrito.productos" // Descomponer los productos en el carrito
          },
          {
            $group: {
              _id: "$carrito.productos.producto_id", // Agrupar por ID del producto
              total_agregado: { $sum: "$carrito.productos.cantidad" } // Calcular la cantidad total agregada
            }
          },
          {
            $lookup: {
              from: "productos", // Relacionar con la colección de productos
              localField: "_id", // Usar el ID del producto agrupado
              foreignField: "_id", // Buscar en el campo _id de productos
              as: "producto_info" // Incluir la información del producto
            }
          },
          {
            $sort: { total_agregado: -1 } // Ordenar por total agregado en orden descendente
          },
          {
            $project: {
              _id: 1,
              total_agregado: 1,
              "producto_info.subcategoria": { $arrayElemAt: ["$producto_info.subcategoria", 0] },
              "producto_info.marca": { $arrayElemAt: ["$producto_info.marca", 0] },
              "producto_info.descripcion": { $arrayElemAt: ["$producto_info.descripcion", 0] }
            }
          },
          {
            $limit: 10 // Limitar a los 10 productos más agregados
          }
        ]);
  
        return res.status(200).json(productos);
      }
  
      // Obtener todos los productos sin filtro
      const productos = await Producto.find();
      res.status(200).json(productos);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      res.status(500).json({ mensaje: 'Error al obtener los productos', error });
    }
  };
  

// Obtener un producto por ID
exports.obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el producto', error });
  }
};

// Crear un nuevo producto
exports.crearProducto = async (req, res) => {
    try {
      // Validar que el cuerpo de la solicitud contenga todos los campos requeridos
      const {
        categoria,
        subcategoria,
        marca,
        modelo,
        descripcion,
        precio,
        tallas_disponibles
      } = req.body;
  
      if (
        !categoria ||
        !subcategoria ||
        !marca ||
        !modelo ||
        !descripcion ||
        !precio ||
        !tallas_disponibles ||
        !Array.isArray(tallas_disponibles) ||
        tallas_disponibles.length === 0
      ) {
        return res.status(400).json({
          mensaje: "Todos los campos son obligatorios, incluidas las tallas disponibles como un array no vacío."
        });
      }
  
      // Crear un nuevo producto
      const nuevoProducto = new Producto({
        categoria,
        subcategoria,
        marca,
        modelo,
        descripcion,
        precio,
        tallas_disponibles
      });
  
      // Guardar el producto en la base de datos
      const productoGuardado = await nuevoProducto.save();
  
      res.status(201).json({
        mensaje: "Producto creado exitosamente",
        producto: productoGuardado
      });
    } catch (error) {
      console.error("Error al crear el producto:", error);
      res.status(400).json({ mensaje: "Error al crear el producto", error: error.message });
    }
  };
  

// Actualizar un producto
exports.actualizarProducto = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        categoria,
        subcategoria,
        marca,
        modelo,
        descripcion,
        precio,
        tallas_disponibles
      } = req.body;
  
      // Validar que al menos uno de los campos esté presente para actualizar
      if (
        !categoria &&
        !subcategoria &&
        !marca &&
        !modelo &&
        !descripcion &&
        !precio &&
        !tallas_disponibles
      ) {
        return res.status(400).json({
          mensaje: "Debe proporcionar al menos un campo para actualizar."
        });
      }
  
      // Validar tallas_disponibles si está presente
      if (tallas_disponibles && (!Array.isArray(tallas_disponibles) || tallas_disponibles.length === 0)) {
        return res.status(400).json({
          mensaje: "El campo 'tallas_disponibles' debe ser un array no vacío."
        });
      }
  
      // Buscar y actualizar el producto
      const productoActualizado = await Producto.findByIdAndUpdate(
        id,
        { categoria, subcategoria, marca, modelo, descripcion, precio, tallas_disponibles },
        { new: true, runValidators: true }
      );
  
      if (!productoActualizado) {
        return res.status(404).json({ mensaje: "Producto no encontrado." });
      }
  
      res.status(200).json({
        mensaje: "Producto actualizado exitosamente.",
        producto: productoActualizado
      });
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      res.status(400).json({ mensaje: "Error al actualizar el producto.", error: error.message });
    }
  };
  

// Eliminar un producto
exports.eliminarProducto = async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!productoEliminado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.status(200).json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el producto', error });
  }
};

//Q1: Listar los productos de una categoría específica
exports.obtenerProductosPorCategoria = async (req, res) => {
    try {
      const { categoria } = req.params;
      const productos = await Producto.find({ categoria });
      res.status(200).json(productos);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener los productos por categoría', error });
    }
  };

  //Q2: Listar los productos de una marca específica
  exports.obtenerProductosPorMarca = async (req, res) => {
    try {
      const { marca } = req.params;
      const productos = await Producto.find({ marca });
      res.status(200).json(productos);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener los productos por marca', error });
    }
  };

  //Q5: Listar los productos con mejores valoraciones
  exports.obtenerProductosMejorValorados = async (req, res) => {
    try {
        const productos = await Producto.aggregate([
            // Unir con los comentarios de los usuarios
            {
                $lookup: {
                    from: "usuarios", // Colección de usuarios
                    localField: "_id", // Campo en la colección de productos
                    foreignField: "comentarios.producto_id", // Campo en la colección de usuarios
                    as: "comentarios" // Alias para los comentarios relacionados
                }
            },
            // Desnormalizar los comentarios para calcular valoraciones
            {
                $unwind: {
                    path: "$comentarios",
                    preserveNullAndEmptyArrays: true // Incluir productos sin comentarios
                }
            },
            {
                $unwind: {
                    path: "$comentarios.comentarios",
                    preserveNullAndEmptyArrays: true // Incluir productos sin comentarios
                }
            },
            // Agrupar por producto para calcular el promedio de valoraciones
            {
                $group: {
                    _id: "$_id", // Agrupar por ID del producto
                    modelo: { $first: "$modelo" },
                    descripcion: { $first: "$descripcion" },
                    promedio_valoracion: { $avg: "$comentarios.comentarios.valoracion" }
                }
            },
            // Ordenar por promedio de valoraciones descendente
            {
                $sort: { promedio_valoracion: -1 }
            },
            // Limitar a los 10 mejores productos
            {
                $limit: 10
            }
        ]);

        // Responder con los productos mejor valorados
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos mejor valorados", details: error.message });
    }
};

  
  // Q6: Listar los productos más agregados a los carritos de compra
exports.obtenerProductosMasAgregados = async (req, res) => {
    try {
        const productos = await Usuario.aggregate([
            {
                $unwind: "$carrito.productos" // Descomponer los productos en el carrito
            },
            {
                $group: {
                    _id: "$carrito.productos.producto_id", // Agrupar por ID del producto
                    total_agregado: { $sum: "$carrito.productos.cantidad" } // Calcular la cantidad total agregada
                }
            },
            {
                $lookup: {
                    from: "productos", // Relacionar con la colección de productos
                    localField: "_id", // Usar el ID del producto agrupado
                    foreignField: "_id", // Buscar en el campo _id de productos
                    as: "producto_info" // Incluir la información del producto
                }
            },
            {
                $sort: { total_agregado: -1 } // Ordenar por total agregado en orden descendente
            },
            {
                $project: {
                    _id: 1,
                    total_agregado: 1,
                    producto_info: {
                        $arrayElemAt: ["$producto_info", 0] // Extraer el primer elemento del array producto_info
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    total_agregado: 1,
                    "producto_info.subcategoria": "$producto_info.subcategoria",
                    "producto_info.marca": "$producto_info.marca",
                    "producto_info.descripcion": "$producto_info.descripcion"
                }
            },
            {
                $limit: 10 // Limitar a los 10 productos más agregados
            }
        ]);

        if (productos.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron productos" });
        }

        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener los productos más agregados:", error);
        res.status(500).json({ mensaje: "Error al obtener los productos más agregados", error: error.message });
    }
};