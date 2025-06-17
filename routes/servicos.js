var express = require('express');
var router = express.Router();
const Servico = require('../models/Servico');

// GET /servicos/:id 
router.get('/:id', async (req, res) => {
    try {
        // Agora usa o Mongoose para encontrar pelo ID no banco de dados.
        const servico = await Servico.findById(req.params.id);
        
        if (servico) {
            res.status(200).json(servico);
        } else {
            res.status(404).json({ message: 'Serviço não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// GET /servicos?clienteId=XXXX
router.get('/', async (req, res) => {
    try {
        // Agora, o clienteId é OBRIGATÓRIO para buscar um histórico
        const { clienteId } = req.query;

        if (!clienteId) {
            // Se não for fornecido um clienteId, retorna um erro ou uma lista vazia.
            return res.status(400).json({ message: 'O ID do cliente é necessário.' });
        }

        // Busca no banco de dados apenas os serviços que pertencem àquele cliente.
        const servicos = await Servico.find({ clienteId: clienteId });
        res.status(200).json(servicos);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /servicos (com filtro)
router.get('/', async (req, res) => {
    try {
        const filtro = req.query.profissionalId ? { profissionalId: req.query.profissionalId } : {};
        const servicos = await Servico.find(filtro);
        res.status(200).json(servicos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




// POST /servicos
router.post('/', async (req, res) => {
    try {
        const novoServico = new Servico(req.body);
        await novoServico.save();
        res.status(201).json(novoServico);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



// PATCH /servicos/:id
router.patch('/:id', async (req, res) => {
    try {
        const servicoAtualizado = await Servico.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(servicoAtualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// DELETE /servicos/:id
router.delete('/:id', async (req, res) => {
    try {
        await Servico.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;