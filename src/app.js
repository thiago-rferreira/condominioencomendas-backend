import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import apiKeyMiddleware from './middlewares/apiKeyMiddleware.js';
import evolutionRoutes from './routes/evolutionRoutes.js';
import encomendasRoutes from './routes/encomendasRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import condominiosRoutes from './routes/condominiosRoutes.js';
import sindicosRoutes from './routes/sindicosRoutes.js';
import porteirosRoutes from './routes/porteirosRoutes.js';
import torresRoutes from './routes/torresRoutes.js';
import apartamentosRoutes from './routes/apartamentosRoutes.js';
import moradoresRoutes from './routes/moradoresRoutes.js';
import authRoutes from './routes/authRoutes.js';
import indicadoresRoutes from './routes/indicadoresRoutes.js';
import validacaoRoutes from './routes/validacaoRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

const api = (path, router) => app.use(`/api/${path}`, apiKeyMiddleware, router);

api('evolution',    evolutionRoutes);
api('encomendas',   encomendasRoutes);
api('upload',       uploadRoutes);
api('condominios',  condominiosRoutes);
api('sindicos',     sindicosRoutes);
api('porteiros',    porteirosRoutes);
api('torres',       torresRoutes);
api('apartamentos', apartamentosRoutes);
api('moradores',    moradoresRoutes);
api('validacao',    validacaoRoutes);
api('indicadores',  indicadoresRoutes);
api('auth',         authRoutes);

app.get('/', (_req, res) => res.send('📦 API de Encomendas ativa!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
