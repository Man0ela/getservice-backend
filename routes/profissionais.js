var express = require("express");
var router = express.Router();
const Profissional = require("../models/Profissional");
const Cliente = require("../models/Cliente"); // Importa modelo Cliente para verificação
const bcrypt = require("bcryptjs");

// CREATE (Criar um novo profissional)
// POST /profissionais
router.post("/", async (req, res) => {
  try {
    const dadosDoFormulario = req.body;

    // Verifica se email já existe entre clientes
    const clienteComMesmoEmail = await Cliente.findOne({
      email: dadosDoFormulario.email,
    });
    if (clienteComMesmoEmail) {
      return res
        .status(409)
        .json({ message: "Este email já está em uso por um cliente." });
    }

    // Verifica se email já existe entre profissionais
    const profissionalExistente = await Profissional.findOne({
      email: dadosDoFormulario.email,
    });
    if (profissionalExistente) {
      return res
        .status(409)
        .json({ message: "Este email já está em uso por outro profissional." });
    }

    // Criptografa a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    dadosDoFormulario.senha = await bcrypt.hash(dadosDoFormulario.senha, salt);

    // Cria o novo profissional
    const novoProfissional = new Profissional(dadosDoFormulario);
    await novoProfissional.save();

    // Remove a senha antes de retornar
    const retorno = novoProfissional.toObject();
    delete retorno.senha;

    // Retorna o profissional recém-criado
    res.status(201).json(retorno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
