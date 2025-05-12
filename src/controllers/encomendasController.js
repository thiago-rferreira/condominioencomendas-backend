const EncomendasModel = require('../models/encomendasModel');

const EncomendasController = {
  async listar(req, res) {
    try {
      const lista = await EncomendasModel.listarTodas();
      res.json(lista);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao listar encomendas.' });
    }
  },

  async buscar(req, res) {
    try {
      const { id } = req.params;
      const encomenda = await EncomendasModel.buscarPorId(id);
      if (!encomenda) return res.status(404).json({ erro: 'Encomenda não encontrada.' });
      res.json(encomenda);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao buscar encomenda.' });
    }
  },

  async criar(req, res) {
    try {
      const dados = req.body;
      const novaEncomenda = await EncomendasModel.criarEncomenda(dados);
      res.status(201).json(novaEncomenda);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao criar encomenda.', detalhes: erro.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;
      const encomendaAtualizada = await EncomendasModel.atualizarEncomenda(id, dados);
      res.json(encomendaAtualizada);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao atualizar encomenda.' });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      await EncomendasModel.deletarEncomenda(id);
      res.json({ mensagem: 'Encomenda removida com sucesso.' });
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao deletar encomenda.' });
    }
  },
};

module.exports = EncomendasController;
