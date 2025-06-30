const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Garante que não haverá dois emails iguais
    },
    senha: {
        type: String,
        required: true
        
    },
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}, { timestamps: true }); // 'timestamps' adiciona os campos createdAt e updatedAt automaticamente
clienteSchema.virtual('id').get(function() {
    return this._id.toHexString();
});
module.exports = mongoose.model('Cliente', clienteSchema);