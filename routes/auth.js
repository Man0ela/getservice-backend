const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Cliente = require("../models/Cliente");
const Profissional = require("../models/Profissional"); // Assumindo que você tenha um modelo Profissional similar
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

    // ✅ Bloco novo e corrigido

// 1. O payload para o token pode ser simples, contendo apenas o essencial.
const tokenPayload = { id: user.id };
const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
  expiresIn: "1h",
});

// 2. Prepara o objeto COMPLETO do usuário para enviar ao frontend.
// Usamos .toObject() para converter o documento do Mongoose em um objeto simples.
const userObject = user.toObject();

// 3. Adiciona o campo 'role' ou 'tipo' que o frontend espera.
// Vamos usar 'role' como padrão para diferenciar do 'tipo' de serviço.
userObject.role = tipoUsuario; 

// A senha já é removida pelo seu Schema, mas podemos garantir aqui por segurança.
delete userObject.senha; 

// 4. Envia o token e o objeto COMPLETO do usuário.
res.status(200).json({ token, user: userObject });

  } catch (error) {
    console.error("💥 Erro no login:", error);
    res.status(500).json({ message: "Erro no servidor." });
  }
});
// ROTA: GET /api/auth/me
// DESCRIÇÃO: Pega os dados do usuário logado usando o token enviado no header.
router.get('/me', authMiddleware, (req, res) => {
    // Se o código chegou até aqui, o middleware já validou o token 
    // e anexou o usuário em 'req.user'. Nós apenas o retornamos.
    res.status(200).json(req.user);
});

module.exports = router;