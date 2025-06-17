const mongoose = require('mongoose');
// A linha abaixo é crucial para carregar a sua Connection String do arquivo .env
require('dotenv').config();

// Importa o modelo que define a estrutura de um profissional
const Profissional = require('./models/Profissional');

// Nossos dados iniciais, que queremos salvar no banco de dados
const profissionaisData = [
    { id: 1, nome: "João Silva", tipo: "Encanador", estrelas: 4, descricao: "Com mais de 10 anos de experiência...", preco: 150, distancia: 30 },
    { id: 2, nome: "Maria Souza", tipo: "Eletricista", estrelas: 5, descricao: "Maria Souza é uma eletricista qualificada...", preco: 200, distancia: 20 },
    { id: 3, nome: "Carlos Santos", tipo: "Pedreiro", estrelas: 3, descricao: "Carlos Santos oferece serviços de alvenaria...", preco: 180, distancia: 15 },
    { id: 4, nome: "Ana Santiago", tipo: "Faxineira", estrelas: 4.6, descricao: "Ana oferece serviços de faxina profunda...", preco: 110, distancia: 6 },
    { id: 5, nome: "Pedro Pereira", tipo: "Jardineiro", estrelas: 4.1, descricao: "Pedro é especialista em jardinagem...", preco: 140, distancia: 9 }
];

// Função principal que executa todo o processo
const seedDatabase = async () => {
    try {
        // 1. Conecta-se ao seu banco de dados MongoDB Atlas
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Conexão com o MongoDB estabelecida para semeadura...');

        // 2. Limpa a coleção de profissionais antes de inserir os novos dados.
        // Isso evita que os dados sejam duplicados se você rodar o script mais de uma vez.
        await Profissional.deleteMany({});
        console.log('Coleção de profissionais limpa com sucesso.');

        // 3. Insere a lista de profissionais no banco de dados
        await Profissional.insertMany(profissionaisData);
        console.log('Dados dos profissionais inseridos com sucesso!');

    } catch (error) {
        console.error('Ocorreu um erro ao semear o banco de dados:', error);
    } finally {
        // 4. Fecha a conexão com o banco de dados, quer tenha dado sucesso ou erro.
        mongoose.connection.close();
        console.log('Conexão com o MongoDB fechada.');
    }
};

// Executa a função para iniciar o processo
seedDatabase();