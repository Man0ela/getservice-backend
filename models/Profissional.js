const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const profissionalSchema = new mongoose.Schema({
    // Campos existentes
    nome: { type: String, required: [true, 'O nome é obrigatório'] },
    tipo: { type: String, required: [true, 'O tipo de serviço é obrigatório'] },
    estrelas: { type: Number, default: 0 },
    descricao: String,

    // <-- CAMPOS DE AUTENTICAÇÃO ADICIONADOS
    email: {
        type: String,
        required: [true, 'O email é obrigatório'],
        unique: true,
        lowercase: true
    },
    senha: {
        type: String,
        required: [true, 'A senha é obrigatória'],
        select: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Adiciona um campo virtual 'id'
profissionalSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Hook para criptografar a senha antes de salvar
profissionalSchema.pre('save', async function(next) {
    if (!this.isModified('senha')) return next();
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

// Método para comparar a senha no login
profissionalSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.senha);
};

// Remove a senha do objeto retornado como JSON
profissionalSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.senha;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Profissional', profissionalSchema);


module.exports = mongoose.model('Profissional', profissionalSchema);