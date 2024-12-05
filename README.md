# DOCUMENTACIÓN DE LA API  
## Bases de Datos NoSQL
> [!NOTE]
> **Alumno:** José Lino Díaz Canales `@joselino25`  
> **Grupo:** 5A (7:00-8:00)  
> **Docente:** Jorge Saúl Montes Cáceres  

---

### **1. Escenario/Caso-03 Tienda en Línea**
### **2. 01 Sección: Solución de caso usando MongoDB Playground**

```javascript
// Selección de la base de datos
use('tienda_online');

// Insertar productos y capturar sus ObjectId
const productosInsertados = db.productos.insertMany([
  { categoria: "Ropa", subcategoria: "Camisas", marca: "Marca", modelo: "Modelo1", descripcion: "Camisa de algodón", precio: 25.99, tallas_disponibles: ["CH", "M", "L"] },
  { categoria: "Ropa", subcategoria: "Pantalones", marca: "Lacoste", modelo: "LacosteSkinnyJeans", descripcion: "Pantalón de mezclilla", precio: 39.99, tallas_disponibles: ["M", "L", "XL"] },
  { categoria: "Ropa", subcategoria: "Pantalones", marca: "Levis", modelo: "Modelo7", descripcion: "Pantalón de mezclilla", precio: 69.99, tallas_disponibles: ["CH", "M", "L", "XL"] },
  { categoria: "Accesorios", subcategoria: "Cadena", marca: "Pandora", modelo: "PandoraNewSeason24", descripcion: "Collar de oro de la marca Pandora", precio: 69.99, tallas_disponibles: ["16in", "20in", "30in"] },
  { categoria: "Ropa", subcategoria: "Chaquetas", marca: "WinterCozy", modelo: "ChaqPro2024", descripcion: "Chaqueta térmica para invierno", precio: 89.99, tallas_disponibles: ["CH", "M", "L", "XL"] },
  { categoria: "Ropa", subcategoria: "Zapatos", marca: "RunFast", modelo: "SportShoesMax", descripcion: "Zapatos deportivos ultraligeros", precio: 59.99, tallas_disponibles: ["7", "8", "9", "10", "11"] },
  { categoria: "Accesorios", subcategoria: "Anillos", marca: "JewelCraft", modelo: "GoldenRing2024", descripcion: "Anillo de oro 18K", precio: 149.99, tallas_disponibles: ["6", "7", "8", "9", "10"] },
  { categoria: "Accesorios", subcategoria: "Relojes", marca: "TimeLuxe", modelo: "TimeMasterX", descripcion: "Reloj analógico con correa de cuero", precio: 199.99, tallas_disponibles: ["20mm", "22mm", "24mm"] },
  { categoria: "Ropa", subcategoria: "Vestidos", marca: "EleganceWear", modelo: "EveningGlam2024", descripcion: "Vestido de noche elegante", precio: 120.99, tallas_disponibles: ["CH", "M", "L", "XL"] },
  { categoria: "Ropa", subcategoria: "Trajes de baño", marca: "AquaStyle", modelo: "SwimPro2024", descripcion: "Traje de baño resistente al cloro", precio: 34.99, tallas_disponibles: ["S", "M", "L", "XL"] }
]);

// IDs de los productos insertados
const camisaId = productosInsertados.insertedIds[0];
const pantalonId = productosInsertados.insertedIds[1];
const pantalonLevisId = productosInsertados.insertedIds[2];
const collarId = productosInsertados.insertedIds[3];
const chaquetasId = productosInsertados.insertedIds[4];
const zapatosId = productosInsertados.insertedIds[5];
const anilloId = productosInsertados.insertedIds[6];
const relojId = productosInsertados.insertedIds[7];
const vestidoId = productosInsertados.insertedIds[8];
const trajeBañoId = productosInsertados.insertedIds[9];

// Función para obtener la marca de un producto dado su ID
function obtenerMarca(productoId) {
  const producto = db.productos.findOne({ _id: productoId });
  return producto ? producto.marca : null;
}


// Obtener los precios de los productos referenciados 
const productos = db.productos.find({ 
  _id: { 
    $in: [camisaId, pantalonId, pantalonLevisId, collarId, chaquetasId, zapatosId, anilloId, relojId, vestidoId, trajeBañoId]
  } 
}).toArray();

// Crear un mapa de precios
const precios = {};
productos.forEach(producto => {
  precios[producto._id.valueOf()] = producto.precio;
});

// Función para calcular precio total
function calcularPrecioTotal(productos) {
  return productos.reduce((total, producto) => {
    const precioProducto = precios[producto.producto_id.valueOf()] || 0;
    return total + (precioProducto * producto.cantidad);
  }, 0);
}

// Insertar usuarios con referencias a los productos
const usuariosInsertados = db.usuarios.insertMany([
  {
    nombre: "Juan Pérez",
    email: "juan@example.com",
    contraseña: "1234",
    direccion_envio: "Calle 1, Ciudad A",
    telefono: "555-1234",
    carrito: {
      productos: [
        { producto_id: camisaId, cantidad: 2, marca: obtenerMarca(camisaId) },
        { producto_id: pantalonId, cantidad: 1, marca: obtenerMarca(pantalonId) },
        { producto_id: relojId, cantidad: 5, marca: obtenerMarca(relojId) },
        { producto_id: trajeBañoId, cantidad: 4, marca: obtenerMarca(trajeBañoId) }
      ]
    },
    pedidos: [
      {
        fecha_pedido: new Date(),
        estado: "enviado",
        productos: [
          { producto_id: camisaId, cantidad: 2 },
          { producto_id: pantalonId, cantidad: 3 },
          { producto_id: zapatosId, cantidad: 6 },
          { producto_id: vestidoId, cantidad: 2 }
        ],
        precio_total: calcularPrecioTotal([
          { producto_id: camisaId, cantidad: 2 },
          { producto_id: pantalonId, cantidad: 3 },
          { producto_id: zapatosId, cantidad: 6 },
          { producto_id: vestidoId, cantidad: 2 }
        ]),
        metodo_pago: "Tarjeta de Debito"
      }
    ],
    comentarios: [
      { producto_id: anilloId, valoracion: 5, comentario: "Excelente calidad" },
      { producto_id: collarId, valoracion: 5, comentario: "Superó mis expectativas, increíble producto" }
    ]
  },
  {
    nombre: "Ana López",
    email: "ana@example.com",
    contraseña: "abcd",
    direccion_envio: "Avenida 2, Ciudad B",
    telefono: "555-5678",
    carrito: {
      productos: [
        { producto_id: pantalonId, cantidad: 1, marca: obtenerMarca(pantalonId) },
        { producto_id: anilloId, cantidad: 3, marca: obtenerMarca(anilloId)},
        { producto_id: trajeBañoId, cantidad: 2, marca: obtenerMarca(trajeBañoId)}
      ]
    },
    pedidos: [
      {
        fecha_pedido: new Date(),
        estado: "pendiente",
        productos: [
          { producto_id: pantalonId, cantidad: 1 },
          { producto_id: anilloId, cantidad: 3},
          { producto_id: trajeBañoId, cantidad: 2}
        ],
        precio_total: calcularPrecioTotal([
          { producto_id: pantalonId, cantidad: 1 },
          { producto_id: anilloId, cantidad: 3},
          { producto_id: trajeBañoId, cantidad: 2} 
        ]),
        metodo_pago: "Paypal"
      }
    ],
    comentarios: [
      { producto_id: collarId, valoracion: 4, comentario: "Buen producto, un poco caro" },
      { producto_id: trajeBañoId, valoracion: 3, comentario: "Aceptable, esperaba más" }
    ]
  },
  {
    nombre: "Cesar Uriel",
    email: "cesar@example.com",
    contraseña: "123",
    direccion_envio: "No se xd",
    telefono: "3112341274",
    carrito: {
      productos: [
        { producto_id: pantalonLevisId, cantidad: 1, marca: obtenerMarca(pantalonLevisId) },
        { producto_id: collarId, cantidad: 2, marca: obtenerMarca(collarId)},
        { producto_id: vestidoId, cantidad: 1, marca: obtenerMarca(vestidoId)}
      ]
    },
    pedidos: [
      {
        fecha_pedido: new Date(),
        estado: "pendiente",
        productos: [
          { producto_id: pantalonLevisId, cantidad: 1 },
          { producto_id: collarId, cantidad: 2},
          { producto_id: vestidoId, cantidad: 1}
        ],
        precio_total: calcularPrecioTotal([
          { producto_id: pantalonLevisId, cantidad: 1 },
          { producto_id: collarId, cantidad: 3},
          { producto_id: vestidoId, cantidad: 1} 
        ]),
        metodo_pago: "Efectivo"
      }
    ],
    comentarios: [
      { producto_id: vestidoId, valoracion: 4, comentario: "Buen producto, un poco caro" },
      { producto_id: pantalonLevisId, valoracion: 3, comentario: "Aceptable, esperaba más" }
    ]
  },
  {
    nombre: "Gabo",
    email: "gabo@example.com",
    contraseña: "holagabo",
    direccion_envio: "16 de septiembre",
    telefono: "3115468729",
    carrito: {
      productos: [
        { producto_id: collarId, cantidad: 1, marca: obtenerMarca(collarId) },
        { producto_id: chaquetasId, cantidad: 3, marca: obtenerMarca(chaquetasId)},
        { producto_id: pantalonLevisId, cantidad: 4, marca: obtenerMarca(pantalonLevisId)}
      ]
    },
    pedidos: [
      {
        fecha_pedido: new Date(),
        estado: "enviado",
        productos: [
          { producto_id: collarId, cantidad: 1 },
          { producto_id: chaquetasId, cantidad: 3},
          { producto_id: pantalonLevisId, cantidad: 4}
        ],
        precio_total: calcularPrecioTotal([
          { producto_id: collarId, cantidad: 1 },
          { producto_id: chaquetasId, cantidad: 3},
          { producto_id: pantalonLevisId, cantidad: 4}
        ]),
        metodo_pago: "Tarjeta de Credito"
      }
    ],
    comentarios: [
      { producto_id: collarId, valoracion: 4, comentario: "Buen producto, un poco caro" },
      { producto_id: chaquetasId, valoracion: 3, comentario: "Aceptable, esperaba más" }
    ]
  }
]);

//usuarios ordenados por el Array
const usuario1Id = usuariosInsertados.insertedIds["0"];
const usuario2Id = usuariosInsertados.insertedIds["1"];
const usuario3Id = usuariosInsertados.insertedIds["2"];
const usuario4Id = usuariosInsertados.insertedIds["3"];
```


### **Consultas MongoDB**
#### **Q1: Listar los productos de una categoría específica**
```javascript
use('tienda_online');
db.productos.find({ categoria: "Ropa" });
```

#### **Q2: Listar los productos de una categoría específica**
```javascript
use('tienda_online');
db.productos.find({ marca: "Levis" });
```
#### **Q3: Listar los productos de una marca específica y los clientes que los han agregado a su carrito.**
```javascript
use('tienda_online');
db.usuarios.aggregate([
  {
    $lookup: {
      from: "productos",
      localField: "carrito.productos.producto_id",
      foreignField: "_id",
      as: "productos_carrito"
    }
  },
  {
    $addFields: {
      productos_carrito: {
        $filter: {
          input: "$productos_carrito",
          as: "producto",
          cond: { $eq: ["$$producto.marca", "Levis"] }
        }
      }
    }
  },
  {
    $match: { "productos_carrito.0": { $exists: true } }
  },
  {
    $project: {
      nombre: 1,
      email: 1,
      "productos_carrito.marca": 1,
      "productos_carrito.modelo": 1
    }
  }
]);
```

#### **Q4. Listar los productos que ha agregado un cliente en específico a su carrito de compras.**
```javascript
use('tienda_online');
db.usuarios.aggregate([
  {
    $match: { email: "juan@example.com" }
  },
  {
    $lookup: {
      from: "productos",
      localField: "carrito.productos.producto_id",
      foreignField: "_id",
      as: "productos_carrito"
    }
  },
  {
    $project: {
      nombre: 1,
      "productos_carrito.descripcion": 1,
      "productos_carrito.subcategoria": 1,
      "productos_carrito.precio": 1
    }
  }
]);
```


#### **Q5. Listar los productos con mejores valoraciones.**
```javascript
use('tienda_online');
db.usuarios.aggregate([
  { $unwind: "$comentarios" },
  { $group: {
      _id: "$comentarios.producto_id",
      promedio_valoracion: { $avg: "$comentarios.valoracion" }
    }
  },
  { $sort: { promedio_valoracion: -1 } },
  { $lookup: {
      from: "productos",
      localField: "_id",
      foreignField: "_id",
      as: "producto_info"
    }
  },
  {
    $project: {
      _id: 0,
      promedio_valoracion: 1,
      "producto_info.modelo": 1,
      "producto_info.descripcion": 1
    }
  }
]);
```


#### **Q6. Listar los productos más agregados a los carritos de compra.**
```javascript
use('tienda_online');
db.usuarios.aggregate([
  {
    $unwind: "$carrito.productos"
  },
  {
    $group: {
      _id: "$carrito.productos.producto_id",
      total_agregado: { $sum: "$carrito.productos.cantidad" }
    }
  },
  {
    $lookup: {
      from: "productos",
      localField: "_id",
      foreignField: "_id",
      as: "producto_info"
    }
  },
  {
    $sort: { total_agregado: -1 }
  },
  {
    $project: {
      "producto_info.marca": 1,
      "producto_info.subcategoria": 1,
      "producto_info.descripcion":1,
      total_agregado: 1
    }
  }
])
```

#### **Q7. Listar todos los pedidos (incluyendo los productos) de un cliente en específico.**
```javascript
use('tienda_online');
db.usuarios.aggregate([
  {
    $match: { email: "juan@example.com" }
  },
  {
    $unwind: "$pedidos"
  },
  {
    $lookup: {
      from: "productos",
      localField: "pedidos.productos.producto_id",
      foreignField: "_id",
      as: "productos_pedido"
    }
  },
  {
    $project: {
      nombre: 1,
      "pedidos.estado": 1,
      "pedidos.precio_total": 1,
      "productos_pedido.marca": 1,
      "productos_pedido.subcategoria": 1,
      "productos_pedido.descripcion": 1
    }
  }
])
```


#### **Q8. Listar todos los productos que ha adquirido un cliente en específico.**
```javascript
use('tienda_online');
db.usuarios.aggregate([
  {
    $match: { email: "gabo@example.com" }
  },
  {
    $unwind: "$pedidos"
  },
  {
    $lookup: {
      from: "productos",
      localField: "pedidos.productos.producto_id",
      foreignField: "_id",
      as: "productos_adquiridos"
    }
  },
  {
    $project: {
      nombre: 1,
      "productos_adquiridos.subcategoria": 1,
      "productos_adquiridos.descripcion": 1,
      "productos_adquiridos.precio": 1
    }
  }
])
```

#### **Q9. Listar todos los Clientes que han comprado un producto en específico.**
```javascript
use('tienda_online');
db.usuarios.aggregate([
  {
    $unwind: "$pedidos"
  },
  {
    $unwind: "$pedidos.productos"
  },
  {
    $match: { "pedidos.productos.producto_id": ObjectId("6751b6f2edadd15c76fe6911") } //Cambiar el ID por el que proporciona MongoDB xd
  },
  {
    $project: {
      nombre: 1,
      email: 1
    }
  }
])
```

### **02 Sección: Solución de caso usando APIs, nodejs, expressjs, mongoose entorno dockerizado**
## **Codigo db.js**
```javascript
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
```
## **Codigo controllers.js**
**Codigo productosController.js**
```javascript
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

```

**Codigo usuariosController.js**
```javascript
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
  
```

## **Codigo routes.js**

