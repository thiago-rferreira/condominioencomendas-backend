// src/controllers/condominiosController.js
const CondominiosModel = require('../models/condominiosModel');

const CondominiosController = {
  async listar(req, res) {
    try {
      const lista = await CondominiosModel.listarTodos();
      res.json(lista);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao listar condomínios.' });
    }
  },

  async buscar(req, res) {
    try {
      const { id } = req.params;
      const condominio = await CondominiosModel.buscarPorId(id);
      if (!condominio) return res.status(404).json({ erro: 'Condomínio não encontrado.' });
      res.json(condominio);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao buscar condomínio.' });
    }
  },

  async criar(req, res) {
    try {
      const novo = await CondominiosModel.criar(req.body);
      res.status(201).json(novo);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao criar condomínio.', detalhes: erro.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const atualizado = await CondominiosModel.atualizar(id, req.body);
      res.json(atualizado);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao atualizar condomínio.', detalhes: erro.message });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      await CondominiosModel.deletar(id);
      res.json({ mensagem: 'Condomínio removido com sucesso.' });
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao deletar condomínio.' });
    }
  }
};

module.exports = CondominiosController;
