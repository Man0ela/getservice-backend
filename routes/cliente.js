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
        
    
        const novoCliente = new Cliente({
            nome,
            email,
            senha 
        });
        
        
        const clienteSalvo = await novoCliente.save();
        
        
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