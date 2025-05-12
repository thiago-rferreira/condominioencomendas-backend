const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const evolutionRoutes = require('./routes/evolutionRoutes');
const encomendasRoutes = require('./routes/encomendasRoutes');

// Configurar variáveis de ambiente
dotenv.config();

const app = express();

// Middleware para analisar JSON
app.use(express.json());

// Usar as rotas definidas
app.use('/api/evolution', evolutionRoutes);
app.use('/api/encomendas', encomendasRoutes);


// Rota base
app.get('/', (req, res) => {
  res.send('📦 API de Encomendas ativa!');
});


// Porta do servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
