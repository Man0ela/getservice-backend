const mongoose = require('mongoose');

const servicoSchema = new mongoose.Schema({
    nome: String,
    tipo: String,
    profissionalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profissional', 
        required: true
    },
    clienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente', 
        required: true
    }, 
    data: Date,
    avaliacao: String,
    avaliacaoGeral: Number,
     status: { 
        type: String,
        enum: ['pendente', 'aceito', 'concluido', 'cancelado'],
        default: 'pendente'
    },
    icon: String
},  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
    });
servicoSchema.virtual('id').get(function() {
    return this._id.toHexString();
});
module.exports = mongoose.model('Servico', servicoSchema);