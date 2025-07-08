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

// Middleware (hook) que criptografa a senha ANTES de salvar
clienteSchema.pre('save', async function(next) {
    // Só faz o hash se a senha foi modificada (ou é nova)
    // <-- CORREÇÃO: trocado 'password' por 'senha'
    if (!this.isModified('senha')) return next();

    // Gera o "sal" e faz o hash da senha
    const salt = await bcrypt.genSalt(10);
    // <-- CORREÇÃO: trocado 'this.password' por 'this.senha' em ambos os lados
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

// Método para comparar a senha enviada no login com a do banco
clienteSchema.methods.comparePassword = async function(candidatePassword) {
    // <-- CORREÇÃO: trocado 'this.password' por 'this.senha'
    return await bcrypt.compare(candidatePassword, this.senha);
};

// Transforma o _id para id e remove __v e a senha no toJSON
clienteSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        // <-- CORREÇÃO: trocado 'ret.password' por 'ret.senha'
        delete ret.senha;
        return ret;
    }
});


const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = Cliente;