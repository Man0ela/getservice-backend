require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('ERRO: A variável MONGO_URI não foi encontrada no arquivo .env!');
  process.exit(1);
}

console.log('Tentando conectar ao MongoDB Atlas...');
console.log('URI:', uri.replace(/:([^:@\s]+)@/, ':*****@')); // Mostra a URI sem a senha

mongoose.connect(uri)
  .then(() => {
    console.log('\n***************************************************');
    console.log('Conexão com MongoDB Atlas bem-sucedida!');
    console.log('***************************************************');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('\n***************************************************');
    console.error('FALHA NA CONEXÃO:', err.message);
    console.error('***************************************************');
  });