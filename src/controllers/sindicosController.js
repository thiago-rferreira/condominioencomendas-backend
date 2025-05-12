const SindicosModel = require('../models/sindicosModel');
const bcrypt = require('bcrypt');

const SindicosController = {
  async listar(req, res) {
    try {
      const lista = await SindicosModel.listarTodos();
      res.json(lista);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao listar síndicos.' });
    }
  },

  async buscar(req, res) {
    try {
      const { id } = req.params;
      const sindico = await SindicosModel.buscarPorId(id);
      if (!sindico) return res.status(404).json({ erro: 'Síndico não encontrado.' });
      res.json(sindico);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao buscar síndico.' });
    }
  },

  async criar(req, res) {
    try {
      const { nome, email, usuario, senha, condominio_id } = req.body;
  
      if (!nome || !email || !usuario || !senha || !condominio_id) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
      }
  
      // 🔐 Criptografar senha antes de salvar
      const senhaCriptografada = await bcrypt.hash(senha, 10);
  
      const novo = await SindicosModel.criar({
        nome,
        email,
        usuario,
        senha: senhaCriptografada,
        condominio_id
      });
  
      res.status(201).json(novo);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao criar síndico.', detalhes: erro.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const atualizado = await SindicosModel.atualizar(id, req.body);
      res.json(atualizado);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao atualizar síndico.' });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      await SindicosModel.deletar(id);
      res.json({ mensagem: 'Síndico removido com sucesso.' });
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao deletar síndico.' });
    }
  }
};

module.exports = SindicosController;
