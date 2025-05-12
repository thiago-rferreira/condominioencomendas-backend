const MoradoresModel = require('../models/moradoresModel');

const MoradoresController = {
  async listar(req, res) {
    try {
      const lista = await MoradoresModel.listarTodos();

      // Renomear campo se quiser
      const resultado = lista.map((m) => {
        const { apartamento, ...resto } = m;
        return { ...resto, apartamento };
      });

      res.json(resultado);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao listar moradores.' });
    }
  },

  async buscar(req, res) {
    try {
      const { id } = req.params;
      const morador = await MoradoresModel.buscarPorId(id);
      if (!morador) return res.status(404).json({ erro: 'Morador não encontrado.' });
      res.json(morador);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao buscar morador.' });
    }
  },

  async criar(req, res) {
    try {
      const { nome, apartamento_id, whatsapp } = req.body;

      if (!nome || !apartamento_id) {
        return res.status(400).json({ erro: 'nome e apartamento_id são obrigatórios.' });
      }

      const novo = await MoradoresModel.criar({ nome, apartamento_id, whatsapp });
      res.status(201).json(novo);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao criar morador.', detalhes: erro.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const atualizado = await MoradoresModel.atualizar(id, req.body);
      res.json(atualizado);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao atualizar morador.' });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      await MoradoresModel.deletar(id);
      res.json({ mensagem: 'Morador removido com sucesso.' });
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao deletar morador.' });
    }
  }
};

module.exports = MoradoresController;
