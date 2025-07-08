const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Cliente = require("../models/Cliente");
const Profissional = require("../models/Profissional"); // Assumindo que você tenha um modelo Profissional similar

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    console.log("🔍 Buscando usuário com email:", email);

    let user = await Cliente.findOne({ email }).select('+senha');
    let tipoUsuario = "cliente";

    if (!user) {
      user = await Profissional.findOne({ email }).select('+senha');
      tipoUsuario = "profissional";
    }

    if (!user) {
      console.log("❌ Nenhum usuário encontrado com esse email.");
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    console.log("✅ Usuário encontrado:", user.email, "| Tipo:", tipoUsuario);

    // <-- MUDANÇA: Usando o método do modelo para comparar a senha
    // É mais limpo e encapsula a lógica no modelo.
    const isMatch = await user.comparePassword(senha);
    if (!isMatch) {
      console.log("❌ Senha incorreta.");
      return res.status(400).json({ message: "Credenciais inválidas." });
    }

    const payload = { id: user.id, nome: user.nome, tipo: tipoUsuario };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
     res.status(200).json({ token, user: payload });
  

  } catch (error) {
    console.error("💥 Erro no login:", error);
    res.status(500).json({ message: "Erro no servidor." });
  }
});

module.exports = router;