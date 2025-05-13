const TorresModel = require('../models/torresModel');

const TorresController = {
  async listar(req, res) {
    try {
      const lista = await TorresModel.listarTodos();
      res.json(lista);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao listar torres/blocos.' });
    }
  },

  async buscar(req, res) {
    try {
      const { id } = req.params;
      const torre = await TorresModel.buscarPorId(id);
      if (!torre) return res.status(404).json({ erro: 'Torre/Bloco não encontrado.' });
      res.json(torre);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao buscar torre/bloco.' });
    }
  },

  async criar(req, res) {
    try {
      const { nome, condominio_id } = req.body;
      if (!nome || !condominio_id) {
        return res.status(400).json({ erro: 'nome e condominio_id são obrigatórios.' });
      }

      const novo = await TorresModel.criar({ nome, condominio_id });
      res.status(201).json(novo);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao criar torre/bloco.', detalhes: erro.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const atualizado = await TorresModel.atualizar(id, req.body);
      res.json(atualizado);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao atualizar torre/bloco.' });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      await TorresModel.deletar(id);
      res.json({ mensagem: 'Torre/Bloco removido com sucesso.' });
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao deletar torre/bloco.' });
    }
  },

  async buscarPorCondominio(req, res) {
    try {
      const { condominio_id } = req.params;
      const torres = await TorresModel.buscarPorCondominio(condominio_id);
      res.json(torres);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao buscar torres/blocos por condomínio.' });
    }
  }
};

module.exports = TorresController;
