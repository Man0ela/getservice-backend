var express = require('express');
var router = express.Router();

// --- Nosso "Banco de Dados em Memória" para Profissionais ---
const profissionais = [
    {
      "id": 1,
      "nome": "João Silva",
      "tipo": "Piscineiro",
      "estrelas": 4,
      "descricao": "Com mais de 10 anos de experiência...",
      "preco": 150,
      "distancia": 30
    },
    {
      "id": 2,
      "nome": "Maria Souza",
      "tipo": "Eletricista",
      "estrelas": 5,
      "descricao": "Maria Souza é uma eletricista qualificada...",
      "preco": 200,
      "distancia": 20
    },
    {
      "id": 3,
      "nome": "Carlos Santos",
      "tipo": "Pedreiro",
      "estrelas": 3,
      "descricao": "Carlos Santos oferece serviços de alvenaria...",
      "preco": 180,
      "distancia": 15
    },
    {
      "id": 4,
      "nome": "Ana Santiago",
      "tipo": "Faxineira",
      "estrelas": 4.6,
      "descricao": "Ana oferece serviços de faxina profunda...",
      "preco": 110,
      "distancia": 6
    },
    {
      "id": 5,
      "nome": "Pedro Pereira",
      "tipo": "Jardineiro",
      "estrelas": 4.1,
      "descricao": "Pedro é especialista em jardinagem...",
      "preco": 140,
      "distancia": 9
    }
];


// --- ROTAS PARA PROFISSIONAIS ---

// READ (Ler todos os profissionais E fazer busca/filtro)
// GET /profissionais OU /profissionais?tipo_like=Faxineira
router.get('/', function(req, res, next) {
    const termoBusca = req.query.tipo_like;

    // Se existe um termo de busca na URL (ex: ?tipo_like=...)
    if (termoBusca) {
        const resultado = profissionais.filter(
            // .toLowerCase() para a busca não diferenciar maiúsculas/minúsculas
            prof => prof.tipo.toLowerCase().includes(termoBusca.toLowerCase())
        );
        res.status(200).json(resultado);
    } else {
        // Se não há termo de busca, retorna a lista completa
        res.status(200).json(profissionais);
    }
});

// READ (Ler um único profissional pelo ID)
// GET /profissionais/:id
router.get('/:id', function(req, res, next) {
    const idProcurado = parseInt(req.params.id);
    const profissional = profissionais.find(p => p.id === idProcurado);

    if (profissional) {
        res.status(200).json(profissional);
    } else {
        res.status(404).json({ message: 'Profissional não encontrado.' });
    }
});


module.exports = router;