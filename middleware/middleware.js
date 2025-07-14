

const jwt = require('jsonwebtoken');
const Profissional = require('../models/Profissional');
const Cliente = require('../models/Cliente');

const middleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Procura o usuário em ambas as coleções (Profissional e Cliente)
        let user = await Profissional.findById(decoded.id).select('-senha');
        if (!user) {
            user = await Cliente.findById(decoded.id).select('-senha');
        }

        if (!user) {
            return res.status(404).json({ message: 'Usuário do token não encontrado.' });
        }

        // Anexa o objeto do usuário à requisição para ser usado nas próximas rotas
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = middleware;