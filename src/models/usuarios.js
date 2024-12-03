const mongoose = require('mongoose');

const ProductoCarritoSchema = new mongoose.Schema({
  producto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true }
});

const ProductoPedidoSchema = new mongoose.Schema({
  producto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true }
});

const PedidoSchema = new mongoose.Schema({
  fecha_pedido: { type: Date, default: Date.now },
  estado: { type: String, enum: ['pendiente', 'enviado', 'entregado', 'cancelado'], required: true },
  productos: { type: [ProductoPedidoSchema], required: true },
  precio_total: { type: Number, required: true },
  metodo_pago: { type: String, enum: ['Tarjeta de Credito', 'Tarjeta de Debito', 'Paypal', 'Efectivo'], required: true }
});

const ComentarioSchema = new mongoose.Schema({
  producto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  valoracion: { type: Number, min: 1, max: 5, required: true },
  comentario: { type: String, required: true }
});

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  direccion_envio: { type: String, required: true },
  telefono: { type: String, required: true },
  carrito: {
    productos: { type: [ProductoCarritoSchema], default: [] }
  },
  pedidos: { type: [PedidoSchema], default: [] },
  comentarios: { type: [ComentarioSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', UsuarioSchema);
