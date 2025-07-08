const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// Rota para CRIAR um novo cliente
// POST /clientes
router.post('/', async (req, res) => {
    try {
        const { email, senha, nome } = req.body;

        // Verifica se o email já existe
        const clienteExistente = await Cliente.findOne({ email });
        if (clienteExistente) {
            return res.status(409).json({ message: 'Este email já está cadastrado.' });
        }
        
        // <-- MUDANÇA: Código simplificado!
        // Apenas criamos o novo cliente com a senha em texto plano.
        // O modelo (hook pre('save')) vai cuidar da criptografia automaticamente.
        const novoCliente = new Cliente({
            nome,
            email,
            senha // Enviamos a senha normal. A mágica acontece no .save()
        });
        
        // Salva o novo cliente no MongoDB (aqui a senha será criptografada)
        const clienteSalvo = await novoCliente.save();
        
        // Retorna o cliente recém-criado (o toJSON do modelo já remove a senha)
        res.status(201).json(clienteSalvo);

    } catch (error) {
        console.error("ERRO NO CADASTRO DE CLIENTE:", error); 
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Dados inválidos.', details: error.errors });
        }
        res.status(500).json({ message: "Erro interno no servidor." });
    }
});

module.exports = router;