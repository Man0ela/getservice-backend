var express = require('express');
var router = express.Router();
const Servico = require('../models/Servico');

// ================================================================
// ## ROTA CORRIGIDA: Listar todos os serviços de um cliente específico ##
// GET /servicos?clienteId=...
// ================================================================
router.get('/', async (req, res) => {
    try {
        // Pega o ID do cliente da query string da URL
        const { clienteId } = req.query;

        // Se o ID do cliente não for fornecido, retorna um erro 400 (Bad Request)
        // Isso corrige o seu erro!
        if (!clienteId) {
            return res.status(400).json({ message: 'O ID do cliente é obrigatório.' });
        }

        // Busca no banco de dados todos os serviços que pertencem àquele cliente
        const servicos = await Servico.find({ clienteId: clienteId });
        
        res.status(200).json(servicos);

    } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
});

// ================================================================
// ## ROTA CORRIGIDA: Criar um novo serviço (Agendamento) ##
// POST /servicos
// ================================================================
router.post('/', async (req, res) => {
    try {
        // Pega os dados do corpo da requisição.
        // O front-end PRECISA enviar todos estes dados.
        const { nome, tipo, profissionalId, data, clienteId } = req.body;

        // Validação para garantir que os campos essenciais não estão faltando
        if (!profissionalId || !clienteId || !data) {
             return res.status(400).json({ message: 'Dados insuficientes para agendar o serviço.' });
        }

        const novoServico = new Servico({
            nome,
            tipo,
            profissionalId,
            data,
            clienteId,
            icon: 'calendar-check' // Icone padrão para agendamento
        });

        const servicoSalvo = await novoServico.save();
        res.status(201).json(servicoSalvo);

    } catch (error) {
        console.error("Erro ao criar serviço:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
});


// ================================================================
// Rota para buscar um serviço por ID (a que você já tinha)
// GET /servicos/:id 
// ================================================================
router.get('/:id', async (req, res) => {
    try {
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


module.exports = router;