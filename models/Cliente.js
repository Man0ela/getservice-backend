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
        // Em um app real, este campo seria criptografado antes de salvar
    },
    // Você pode adicionar outros campos aqui no futuro, como endereço, telefone, etc.
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}, { timestamps: true }); // 'timestamps' adiciona os campos createdAt e updatedAt automaticamente
clienteSchema.virtual('id').get(function() {
    return this._id.toHexString();
});
module.exports = mongoose.model('Cliente', clienteSchema);