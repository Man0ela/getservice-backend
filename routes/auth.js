const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Cliente = require("../models/Cliente");
const Profissional = require("../models/Profissional"); 
const authMiddleware = require('../middleware/middleware');
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
      console.log(" Nenhum usuário encontrado com esse email.");
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    console.log("Usuário encontrado:", user.email, "| Tipo:", tipoUsuario);

    
    const isMatch = await user.comparePassword(senha);
    if (!isMatch) {
      console.log("❌ Senha incorreta.");
      return res.status(400).json({ message: "Credenciais inválidas." });
    }

  


const tokenPayload = { id: user.id };
const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
  expiresIn: "1h",
});


const userObject = user.toObject();


userObject.role = tipoUsuario; 


delete userObject.senha; 


res.status(200).json({ token, user: userObject });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro no servidor." });
  }
});
// ROTA: GET /api/auth/me

router.get('/me', authMiddleware, (req, res) => {
    
    res.status(200).json(req.user);
});

module.exports = router;