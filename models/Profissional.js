const mongoose = require('mongoose');

const profissionalSchema = new mongoose.Schema({
    nome: String,
    tipo: String,
    estrelas: Number,
    descricao: String,
    preco: Number,
    distancia: Number
},
    {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    });
    
profissionalSchema.virtual('id').get(function() {
    return this._id.toHexString();
});


module.exports = mongoose.model('Profissional', profissionalSchema);