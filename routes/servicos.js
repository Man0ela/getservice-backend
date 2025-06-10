var express = require('express');
var router = express.Router();

// --- Nosso "Banco de Dados em Memória" Temporário ---
// Estes são os dados iniciais. As rotas abaixo irão modificar este array.
// Se o servidor for reiniciado, ele voltará a este estado original.
let servicos =[];

// Variável para gerar novos IDs de forma simples
let proximoId = servicos.length > 0 ? Math.max(...servicos.map(s => s.id)) + 1 : 1;

// ###########################################################
// ##                  ROTAS DO CRUD                      ##
// ###########################################################


// READ (Ler todos os serviços)
// GET /servicos
router.get('/', function(req, res, next) {
    // Simplesmente retornamos o array completo de serviços.
    res.status(200).json(servicos);
});

// READ (Ler um único serviço pelo ID)
// GET /servicos/:id
router.get('/:id', function(req, res, next) {
    const idProcurado = parseInt(req.params.id);
    const servico = servicos.find(s => s.id === idProcurado);

    if (servico) {
        res.status(200).json(servico);
    } else {
        // Se não encontrar o serviço, retorna um erro 404 (Not Found)
        res.status(404).json({ message: 'Serviço não encontrado.' });
    }
});


// CREATE (Criar um novo serviço)
// POST /servicos
router.post('/', function(req, res, next) {
    // Os dados do novo serviço vêm no corpo (body) da requisição
    const novoServico = req.body;
  
    // Atribuímos um novo ID único
    novoServico.id = proximoId++;
  
    // Adicionamos o novo serviço ao nosso array
    servicos.push(novoServico);
  
    // Retornamos o serviço completo (com o novo ID) e o status 201 (Created)
    res.status(201).json(novoServico);
});


// UPDATE (Atualizar um serviço existente)
// PATCH /servicos/:id
router.patch('/:id', function(req, res, next) {
    const idProcurado = parseInt(req.params.id);
    const dadosUpdate = req.body;
    
    const indexDoServico = servicos.findIndex(s => s.id === idProcurado);

    if (indexDoServico !== -1) {
        // Pega o serviço original
        const servicoOriginal = servicos[indexDoServico];
        
        // Combina o original com os novos dados (o que for enviado no body, substitui)
        const servicoAtualizado = { ...servicoOriginal, ...dadosUpdate };
        
        // Coloca o serviço atualizado de volta no array
        servicos[indexDoServico] = servicoAtualizado;

        res.status(200).json(servicoAtualizado);
    } else {
        res.status(404).json({ message: 'Serviço não encontrado para atualização.' });
    }
});


// DELETE (Deletar um serviço)
// DELETE /servicos/:id
router.delete('/:id', function(req, res, next) {
    const idProcurado = parseInt(req.params.id);
    const servicoIndex = servicos.findIndex(s => s.id === idProcurado);

    if (servicoIndex !== -1) {
        // Remove o serviço do array
        servicos.splice(servicoIndex, 1);
        
        // Retorna uma resposta de sucesso sem conteúdo
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Serviço não encontrado para exclusão.' });
    }
});


module.exports = router;