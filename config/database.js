const mongoose = require('mongoose');
require('dotenv').config(); // Carrega as variáveis do arquivo .env

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Conexão com o MongoDB estabelecida com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar com o MongoDB:', error.message);
        process.exit(1); // Sai do processo com falha
    }
};

module.exports = connectDB;