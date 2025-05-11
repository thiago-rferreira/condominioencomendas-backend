const express = require('express');
const dotenv = require('dotenv');
const evolutionRoutes = require('./routes/evolutionRoutes');

// Configurar variáveis de ambiente
dotenv.config();

const app = express();

// Middleware para analisar JSON
app.use(express.json());

// Usar as rotas definidas
app.use('/api/evolution', evolutionRoutes);

// Porta do servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
