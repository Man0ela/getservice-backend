const mongoose = require('mongoose');

const profissionalSchema = new mongoose.Schema({
    nome: String,
    tipo: String,
    estrelas: Number,
    descricao: String,
    preco: Number,
    distancia: Number
});

module.exports = mongoose.model('Profissional', profissionalSchema);