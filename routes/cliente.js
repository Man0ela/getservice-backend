var express = require('express');
var router = express.Router();
const Cliente = require('../models/Cliente'); // Importa o modelo que acabamos de criar

// Rota para CRIAR um novo cliente
// POST /clientes
router.post('/', async (req, res) => {
    try {
        // Verifica se o email já existe para evitar cadastros duplicados
        const clienteExistente = await Cliente.findOne({ email: req.body.email });
        if (clienteExistente) {
            // Retorna um erro 409 (Conflict) se o email já estiver em uso
            return res.status(409).json({ message: 'Este email já está cadastrado.' });
        }
        
        // Cria uma nova instância do cliente com os dados do formulário
        const novoCliente = new Cliente(req.body);
        
        // Salva o novo cliente no MongoDB
        await novoCliente.save();
        
        // Retorna o cliente recém-criado com o status 201 (Created)
        res.status(201).json(novoCliente);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// No futuro, você pode adicionar outras rotas aqui:
// GET /clientes (para listar todos os clientes - talvez para um admin)
// GET /clientes/:id (para ver um cliente específico)
// etc.

module.exports = router;