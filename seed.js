const mongoose = require('mongoose');
// A linha abaixo é crucial para carregar a sua Connection String do arquivo .env
require('dotenv').config();

// Importa o modelo que define a estrutura de um profissional
const Profissional = require('./models/Profissional');

// Nossos dados iniciais, agora com os campos obrigatórios de email e senha
const profissionaisData = [
    { 
        nome: "João Silva", 
        tipo: "Encanador", 
        email: "joao.silva@encanador.com", // <-- ADICIONADO
        senha: "123", // <-- ADICIONADO (o modelo vai criptografar)
        estrelas: 4, 
        descricao: "Com mais de 10 anos de experiência...", 
    },
    { 
        nome: "Maria Souza", 
        tipo: "Eletricista", 
        email: "maria.souza@eletricista.com", // <-- ADICIONADO
        senha: "123", // <-- ADICIONADO
        estrelas: 5, 
        descricao: "Maria Souza é uma eletricista qualificada...",
    },
    { 
        nome: "Carlos Santos", 
        tipo: "Pedreiro", 
        email: "carlos.santos@pedreiro.com", // <-- ADICIONADO
        senha: "123", // <-- ADICIONADO
        estrelas: 3, 
        descricao: "Carlos Santos oferece serviços de alvenaria...",
    },
    { 
        nome: "Ana Santiago", 
        tipo: "Faxineira", 
        email: "ana.santiago@faxineira.com", // <-- ADICIONADO
        senha: "123", // <-- ADICIONADO
        estrelas: 4.6, 
        descricao: "Ana oferece serviços de faxina profunda...",
    },
    { 
        nome: "Pedro Pereira", 
        tipo: "Jardineiro", 
        email: "pedro.pereira@jardineiro.com", // <-- ADICIONADO
        senha: "123", // <-- ADICIONADO
        estrelas: 4.1, 
        descricao: "Pedro é especialista em jardinagem...",
    }
];

// Função principal que executa todo o processo
const seedDatabase = async () => {
    try {
        // 1. Conecta-se ao seu banco de dados MongoDB Atlas
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Conexão com o MongoDB estabelecida para semeadura...');

        // 2. Limpa a coleção de profissionais antes de inserir os novos dados.
        await Profissional.deleteMany({});
        console.log('Coleção de profissionais limpa com sucesso.');

        // 3. Insere a lista de profissionais no banco de dados
        // Usamos .create() que também aciona os hooks de 'save' como o pre('save') da senha
        await Profissional.create(profissionaisData);
        console.log('Dados dos profissionais inseridos com sucesso!');

    } catch (error) {
        console.error('Ocorreu um erro ao semear o banco de dados:', error);
    } finally {
        // 4. Fecha a conexão com o banco de dados
        await mongoose.connection.close();
        console.log('Conexão com o MongoDB fechada.');
    }
};

// Executa a função para iniciar o processo
seedDatabase();