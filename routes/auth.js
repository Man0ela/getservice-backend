const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Para usar a chave secreta

// Importa os models para procurar os usuários
const Cliente = require('../models/Cliente');
const Profissional = require('../models/Profissional');

// Rota de Login
// POST /auth/login
router.post('/login', async (req, res) => {
    const { email, senha, tipoUsuario } = req.body;

    try {
        // 1. Encontra o usuário pelo email
        let user;
        if (tipoUsuario === 'cliente') {
            user = await Cliente.findOne({ email });
        } else if (tipoUsuario === 'profissional') {
            user = await Profissional.findOne({ email });
        }

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // 2. Compara a senha enviada com a senha criptografada no banco
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        // 3. Se tudo estiver certo, cria um Token de Acesso (JWT)
        const payload = {
            id: user.id,
            nome: user.nome,
            tipo: tipoUsuario
        };
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        // 4. Envia o token e os dados do usuário de volta para o front-end
        res.status(200).json({
            token,
            user: payload
        });

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

module.exports = router;