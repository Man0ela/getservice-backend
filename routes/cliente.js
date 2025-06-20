var express = require('express');
const bcrypt = require('bcryptjs');
var router = express.Router();
const Cliente = require('../models/Cliente');

// Rota para CRIAR um novo cliente
// POST /clientes
router.post('/', async (req, res) => {
    try {
        // 1. Pega os dados do formulário
        const { email, senha, nome } = req.body;

        // 2. Verifica se o email já existe para evitar cadastros duplicados
        const clienteExistente = await Cliente.findOne({ email: email });
        if (clienteExistente) {
            return res.status(409).json({ message: 'Este email já está cadastrado.' });
        }
        
        // 3. Criptografa a senha ANTES de qualquer outra coisa
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);
        
        // 4. Cria a nova instância do cliente com os dados corretos e a senha JÁ criptografada
        const novoCliente = new Cliente({
            nome: nome,
            email: email,
            senha: senhaCriptografada
        });
        
        // 5. Salva o novo cliente no MongoDB
        await novoCliente.save();
        
        // 6. Retorna o cliente recém-criado (sem a senha) com o status 201 (Created)
        // Por segurança, é uma boa prática não retornar a senha na resposta da API.
        const clienteParaRetorno = novoCliente.toObject();
        delete clienteParaRetorno.senha;

        res.status(201).json(clienteParaRetorno);

    } catch (error) {
        console.error("ERRO NO CADASTRO DE CLIENTE:", error); 
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Dados inválidos. Por favor, preencha todos os campos obrigatórios.', details: error.errors });
        }
        res.status(500).json({ message: "Erro interno no servidor." });
    }
});


// (As outras rotas GET, etc., podem ser adicionadas aqui no futuro)

module.exports = router;