var express = require('express');
var router = express.Router();

// --- Nosso "Banco de Dados em Memória" Temporário ---
// Estes são os dados iniciais. As rotas abaixo irão modificar este array.
// Se o servidor for reiniciado, ele voltará a este estado original.
let servicos =[];
let proximoId = servicos.length > 0 ? Math.max(...servicos.map(s => s.id)) + 1 : 1;




router.get('/', function(req, res, next) {
    
    res.status(200).json(servicos);
});


router.get('/:id', function(req, res, next) {
    const idProcurado = parseInt(req.params.id);
    const servico = servicos.find(s => s.id === idProcurado);

    if (servico) {
        res.status(200).json(servico);
    } else {
        
        res.status(404).json({ message: 'Serviço não encontrado.' });
    }
});



router.post('/', function(req, res, next) {
    
    const novoServico = req.body;
  
    
    novoServico.id = proximoId++;
  
    
    servicos.push(novoServico);
  
   
    res.status(201).json(novoServico);
});



router.patch('/:id', function(req, res, next) {
    const idProcurado = parseInt(req.params.id);
    const dadosUpdate = req.body;
    
    const indexDoServico = servicos.findIndex(s => s.id === idProcurado);

    if (indexDoServico !== -1) {
        
        const servicoOriginal = servicos[indexDoServico];
        
        
        const servicoAtualizado = { ...servicoOriginal, ...dadosUpdate };
        
        
        servicos[indexDoServico] = servicoAtualizado;

        res.status(200).json(servicoAtualizado);
    } else {
        res.status(404).json({ message: 'Serviço não encontrado para atualização.' });
    }
});



router.delete('/:id', function(req, res, next) {
    const idProcurado = parseInt(req.params.id);
    const servicoIndex = servicos.findIndex(s => s.id === idProcurado);

    if (servicoIndex !== -1) {
        
        servicos.splice(servicoIndex, 1);
        
        
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Serviço não encontrado para exclusão.' });
    }
});


module.exports = router;