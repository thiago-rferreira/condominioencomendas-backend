// controllers/indicadoresController.js
const IndicadoresModel = require('../models/indicadoresModel');

const IndicadoresController = {
  async obterIndicadores(req, res) {
    try {
      const { condominioId } = req.params;
      const indicadores = await IndicadoresModel.buscarIndicadores(condominioId);
      res.json(indicadores);
    } catch (erro) {
        console.error('Erro ao buscar indicadores:', erro);
      res.status(500).json({ erro: 'Erro ao buscar indicadores.' });
    }
  },
};

module.exports = IndicadoresController;
