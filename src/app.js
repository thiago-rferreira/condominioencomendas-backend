const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const apiKeyMiddleware = require('./middlewares/apiKeyMiddleware');
const evolutionRoutes = require('./routes/evolutionRoutes');
const encomendasRoutes = require('./routes/encomendasRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const condominiosRoutes = require('./routes/condominiosRoutes');
const sindicosRoutes = require('./routes/sindicosRoutes');
const porteirosRoutes = require('./routes/porteirosRoutes');
const torresRoutes = require('./routes/torresRoutes');
const apartamentosRoutes = require('./routes/apartamentosRoutes');


// Configurar variáveis de ambiente
dotenv.config();

const app = express();

// Middleware para analisar JSON
app.use(express.json());

// Usar as rotas definidas
app.use('/api/evolution', apiKeyMiddleware, evolutionRoutes);
app.use('/api/encomendas', apiKeyMiddleware, encomendasRoutes);
app.use('/api/upload', apiKeyMiddleware, uploadRoutes);
app.use('/api/condominios', apiKeyMiddleware, condominiosRoutes);
app.use('/api/sindicos', apiKeyMiddleware, sindicosRoutes);
app.use('/api/porteiros', apiKeyMiddleware, porteirosRoutes);
app.use('/api/torres', apiKeyMiddleware, torresRoutes);
app.use('/api/apartamentos', apiKeyMiddleware, apartamentosRoutes);



// Rota base
app.get('/', (req, res) => {
  res.send('📦 API de Encomendas ativa!');
});


// Porta do servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
