const mongoose = require('mongoose');

const servicoSchema = new mongoose.Schema({
    nome: String,
    tipo: String,
    profissionalId: Number, // No futuro, podemos usar um tipo de referência do Mongoose
    data: Date,
    avaliacao: String,
    avaliacaoGeral: Number,
    icon: String
});

module.exports = mongoose.model('Servico', servicoSchema);