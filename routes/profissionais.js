var express = require('express');
var router = express.Router();
const Profissional = require('../models/Profissional'); // 1. Importa o modelo Profissional

// O array em memória foi REMOVIDO daqui.

// --- ROTAS PARA PROFISSIONAIS ---

// READ (Ler todos os profissionais E fazer busca/filtro)
// GET /profissionais OU /profissionais?tipo_like=Faxineira
router.get('/', async (req, res) => {
    try {
        const termoBusca = req.query.tipo_like;
        let filtro = {};

        // Se existe um termo de busca na URL...
        if (termoBusca) {
            // ...cria um filtro usando RegEx para buscar texto parcial e ignorar maiúsculas/minúsculas.
            // Isso substitui o `tipo_like` do json-server.
            filtro = { tipo: { $regex: termoBusca, $options: 'i' } };
        }

        // Busca no banco de dados com o filtro (ou sem filtro, se não houver termo de busca)
        const profissionais = await Profissional.find(filtro);
        res.status(200).json(profissionais);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CREATE (Criar um novo profissional)
// POST /profissionais
router.post('/', async (req, res) => {
    try {
        // req.body contém os dados enviados pelo formulário do front-end
        const novoProfissional = new Profissional(req.body);
        
        // Salva o novo profissional no banco de dados MongoDB
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