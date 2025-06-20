var express = require('express');
var router = express.Router();
const Profissional = require('../models/Profissional'); // 1. Importa o modelo Profissional
const bcrypt = require('bcryptjs');
// O array em memória foi REMOVIDO daqui.

// --- ROTAS PARA PROFISSIONAIS ---

// READ (Ler todos os profissionais E fazer busca/filtro)
// GET /profissionais OU /profissionais?tipo_like=Faxineira
router.get('/', async (req, res) => {
    try {
        const termoBusca = req.query.tipo_like;
        let filtro = {};

        if (termoBusca) {
            filtro = { tipo: { $regex: termoBusca, $options: 'i' } };
        }

        const profissionais = await Profissional.find(filtro);
        res.status(200).json(profissionais);
    } catch (error) {
        console.error("ERRO NO CADASTRO DE CLIENTE:", error); // Imprime o erro detalhado no console do back-end
        if (error.name === 'ValidationError') {
            // Se for um erro de validação do Mongoose, envia uma mensagem mais clara
            return res.status(400).json({ message: 'Dados inválidos. Por favor, preencha todos os campos obrigatórios.', details: error.errors });
        }
        res.status(500).json({ message: "Erro interno no servidor." });
    }
});

// CREATE (Criar um novo profissional)
// POST /profissionais
router.post('/', async (req, res) => {
    const dadosDoFormulario = req.body;
    try {
        
        // Criptografa a senha antes de salvar
        const salt = await bcrypt.genSalt(10);
        dadosDoFormulario.senha = await bcrypt.hash(dadosDoFormulario.senha, salt);
        
        // Agora salva o usuário com a senha já criptografada
         const novoProfissional = new Profissional(req.body);
        await novoProfissional.save();
        
        
        // Retorna o profissional recém-criado com o status 201 (Created)
        res.status(201).json(novoProfissional);
    } catch (error) {
        // Se houver um erro de validação ou outro problema, retorna o erro
        res.status(400).json({ message: error.message });
    }
});

// READ (Ler um único profissional pelo ID)
// GET /profissionais/:id
router.get('/:id', async (req, res) => {
    try {
        const profissional = await Profissional.findById(req.params.id);
        
        if (profissional) {
            res.status(200).json(profissional);
        } else {
            res.status(404).json({ message: 'Profissional não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;