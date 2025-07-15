const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const clienteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome é obrigatório']
    },
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
    timestamps: true
});


clienteSchema.pre('save', async function(next) {
    
    if (!this.isModified('senha')) return next();

    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

// Método para comparar a senha enviada no login com a do banco
clienteSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.senha);
};


clienteSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.senha;
        return ret;
    }
});


const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = Cliente;