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
router.patch('/:id', async (req, res) => {
    try {
        // CORREÇÃO: Espera 'avaliacaoGeral' em vez de 'nota'
        const { avaliacao, avaliacaoGeral } = req.body;

        // A validação agora checa por 'avaliacaoGeral'
        if (avaliacao === undefined || avaliacaoGeral === undefined) {
            return res.status(400).json({ message: "Dados de avaliação (avaliação e avaliacaoGeral) são obrigatórios." });
        }
        
        const servicoAtualizado = await Servico.findByIdAndUpdate(
            req.params.id,
            { 
                avaliacao: avaliacao,
                // O campo no banco de dados também é 'avaliacaoGeral'
                avaliacaoGeral: avaliacaoGeral 
            },
            { new: true, runValidators: true }
        );

        if (!servicoAtualizado) {
            return res.status(404).json({ message: 'Serviço não encontrado para avaliar.' });
        }

        res.status(200).json(servicoAtualizado);

    } catch (error) {
        console.error("Erro ao enviar avaliação:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
});
// NOVA ROTA: Buscar serviços por ID do profissional
// GET /api/servicos/profissional/:profissionalId
router.get('/profissional/:profissionalId', async (req, res) => {
  try {
    const { profissionalId } = req.params;

    // Busca todos os serviços associados ao profissional
    const todosOsServicos = await Servico.find({ profissionalId }).populate('clienteId', 'nome');

    // Separa os serviços em histórico (concluídos) e solicitações (pendentes)
    // (Esta lógica pode variar dependendo do seu model de 'Servico')
    const historico = todosOsServicos.filter(s => s.status === 'concluido');
    const solicitacoes = todosOsServicos.filter(s => s.status === 'pendente' || s.status === 'aceito');

    res.json({ historico, solicitacoes });

  } catch (error) {
    console.error("Erro ao buscar serviços do profissional:", error);
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

router.delete('/:id', async (req, res) => {
    try {
        const servicoCancelado = await Servico.findByIdAndDelete(req.params.id);

        if (!servicoCancelado) {
            return res.status(404).json({ message: 'Serviço não encontrado para cancelamento.' });
        }

        // Retorna uma mensagem de sucesso
        res.status(200).json({ message: 'Serviço cancelado com sucesso.' });

    } catch (error) {
        console.error("Erro ao cancelar serviço:", error);
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