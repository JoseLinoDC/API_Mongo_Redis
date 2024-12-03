const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  categoria: { type: String, required: true },
  subcategoria: { type: String, required: true },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  tallas_disponibles: { type: [String], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Producto', ProductoSchema);
