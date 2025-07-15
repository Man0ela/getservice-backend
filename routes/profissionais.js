var express = require("express");
var router = express.Router();
const Profissional = require("../models/Profissional");
const Cliente = require("../models/Cliente");

// ## NOVA ROTA: Listar e Buscar Profissionais ##
// 

router.get("/", async (req, res) => {
  try {
    const termoBusca = req.query.tipo_like;
    let query = {}; // Inicia uma query vazia

    // Se um termo de busca foi enviado na URL...
    if (termoBusca) {
      const regex = new RegExp(termoBusca, 'i');
      query.tipo = regex; // Adiciona o filtro por 'tipo' na query
    }

    
    const profissionais = await Profissional.find(query);
    
    
    res.status(200).json(profissionais);

  } catch (error) {
    console.error("Erro ao buscar profissionais:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});



// POST /profissionai
router.post("/", async (req, res) => {
  try {
    const { email, nome, senha, tipo, descricao, valorPorHora, distanciaMaxima } = req.body;

    const emailEmUso = await Cliente.findOne({ email }) || await Profissional.findOne({ email });
    if (emailEmUso) {
      return res.status(409).json({ message: "Este email já está cadastrado." });
    }

    const novoProfissional = new Profissional({
        nome,
        email,
        senha,
        tipo,
        descricao,
        valorPorHora,    
        distanciaMaxima  
    });

    const profissionalSalvo = await novoProfissional.save();
    res.status(201).json(profissionalSalvo);

  } catch (error) {
    console.error("ERRO NO CADASTRO DE PROFISSIONAL:", error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Dados inválidos.', details: error.errors });
    }
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});

module.exports = router;