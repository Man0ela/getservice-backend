const mongoose = require('mongoose');

const servicoSchema = new mongoose.Schema({
    nome: String,
    tipo: String,
    profissionalId: String, // No futuro, podemos usar um tipo de referência do Mongoose
    data: Date,
    avaliacao: String,
    avaliacaoGeral: Number,
    icon: String
},  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
    });
servicoSchema.virtual('id').get(function() {
    return this._id.toHexString();
});
module.exports = mongoose.model('Servico', servicoSchema);