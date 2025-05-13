const prisma = require('../config/prisma');
const ApartamentosModel = require('../models/apartamentosModel');

const ApartamentosController = {
  async listar(req, res) {
    try {
      const lista = await ApartamentosModel.listarTodos();
      res.json(lista);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao listar apartamentos.' });
    }
  },

  async buscar(req, res) {
    try {
      const { id } = req.params;
      const apto = await ApartamentosModel.buscarPorId(id);
      if (!apto) return res.status(404).json({ erro: 'Apartamento não encontrado.' });
      res.json(apto);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao buscar apartamento.' });
    }
  },

  async criar(req, res) {
    try {
      const { numero, torre_id, condominiosId } = req.body;

      if (!numero || !torre_id) {
        return res.status(400).json({ erro: 'numero e torre_id são obrigatórios.' });
      }

      // Verificar se já existe o número nesse mesmo bloco/torre
      const duplicado = await prisma.apartamentos.findFirst({
        where: {
          numero,
          torre_id
        }
      });

      if (duplicado) {
        return res.status(400).json({ erro: `Apartamento ${numero} já existe na Torre ${torre_id}.` });
      }

      const novo = await ApartamentosModel.criar({ numero, torre_id, condominiosId });
      res.status(201).json(novo);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao criar apartamento.', detalhes: erro.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const atualizado = await ApartamentosModel.atualizar(id, req.body);
      res.json(atualizado);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao atualizar apartamento.' });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      await ApartamentosModel.deletar(id);
      res.json({ mensagem: 'Apartamento removido com sucesso.' });
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao deletar apartamento.' });
    }
  },

  async buscarPorCondominio(req, res) {
    try {
      const { id } = req.params;
      const apartamentos = await ApartamentosModel.buscarPorCondominio(id);
      res.json(apartamentos);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao buscar apartamentos por condomínio.' });
    }
  }
};

module.exports = ApartamentosController;
