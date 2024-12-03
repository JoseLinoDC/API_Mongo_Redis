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
  { categoria: "Ropa", subcategoria: "Trajes de baño", marca: "AquaStyle", modelo: "SwimPro2024", descripcion: "Traje de baño resistente al cloro", precio: 34.99, tallas_disponibles: ["S", "M", "L", "XL"] },
  { categoria: "Accesorios", subcategoria: "Pulseras", marca: "WristCharm", modelo: "BraceletGold25", descripcion: "Pulsera de oro con incrustaciones", precio: 89.99, tallas_disponibles: ["6in", "7in", "8in"] },
  { categoria: "Accesorios", subcategoria: "Collares", marca: "ShinyNeck", modelo: "NecklacePearlX", descripcion: "Collar de perlas auténticas", precio: 109.99, tallas_disponibles: ["16in", "18in", "20in"] },
  { categoria: "Ropa", subcategoria: "Faldas", marca: "UrbanChic", modelo: "SkirtLine2024", descripcion: "Falda casual para uso diario", precio: 45.99, tallas_disponibles: ["CH", "M", "L", "XL"] },
  { categoria: "Ropa", subcategoria: "Guantes", marca: "HandWarm", modelo: "GloveThermoMax", descripcion: "Guantes térmicos para clima frío", precio: 29.99, tallas_disponibles: ["S", "M", "L"] }
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

// Obtener los precios de los productos referenciados, Chatgpt GOD lo Hizo 
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


// Q1: Listar los productos de una categoría específica
use('tienda_online');
db.productos.find({ categoria: "Ropa" })

// Q2: Listar los productos de una marca específica.
use('tienda_online');
db.productos.find({ marca: "Levis" })


// Agradecimientos ChatGPT
//Q3: Listar los productos de una marca específica y los clientes que los han agregado a su carrito.
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
          cond: { $eq: ["$$producto.marca", "Levis"] } //Cambiar marca para filtrar el producto que queremos
        }
      }
    }
  },
  {
    $match: {
      "productos_carrito.0": { $exists: true } // Filtrar usuarios con al menos un producto de la marca "Levis"
    }
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
db.usuarios.find({}, { "carrito.productos.producto_id": 1 }).pretty();


//Q4: Listar los productos que ha agregado un cliente en específico a su carrito de compras.
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
])


//Q5: Listar los productos con mejores valoraciones.
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




//Q6: Listar los productos más agregados a los carritos de compra.
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

//Q7: Listar todos los pedidos (incluyendo los productos) de un cliente en específico.
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

//Q8: Listar todos los productos que ha adquirido un cliente en específico.
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


//Q9: Listar todos los Clientes que han comprado un producto en específico.
use('tienda_online');
db.usuarios.aggregate([
  {
    $unwind: "$pedidos"
  },
  {
    $unwind: "$pedidos.productos"
  },
  {
    $match: { "pedidos.productos.producto_id": ObjectId("674e88420e84da1963326e43") } //Cambiar el ID por el que proporciona MongoDB xd
  },
  {
    $project: {
      nombre: 1,
      email: 1
    }
  }
])
