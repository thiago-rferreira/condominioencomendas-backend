const MoradoresModel = require('../models/moradoresModel');

const MoradoresController = {
  async listar(req, res) {
    try {
      const lista = await MoradoresModel.listarTodos();
  
      const resultado = lista.map((m) => ({
        nome: m.nome,
        apartamento_id: m.apartamento_id,
        whatsapp: m.whatsapp,
        status: m.status,
        apartamento_numero: m.apartamento?.numero,
        torre_id: m.apartamento?.torre?.id,
        torre_nome: m.apartamento?.torre?.nome,
        condominiosId: m.apartamento?.condominiosId
      }));
  
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
  },

  async listarPorApartamento(req, res) {
    try {
      const { id } = req.params;
      const moradores = await MoradoresModel.listarPorApartamento(id);
      res.json(moradores);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao listar moradores do apartamento.' });
    }
  },

  async criarViaWhatsApp(req, res) {
    try {
      const { codigo_acesso, nome, torre, apartamento_numero, whatsapp } = req.body;

      // 1. Validar condomínio
      const condominio = await MoradoresModel.buscarCondominioPorCodigo(codigo_acesso);
      if (!condominio) {
        return res.status(400).json({ erro: 'Código de acesso inválido.' });
      }

      // 2. Validar torre
      const torreEncontrada = await MoradoresModel.buscarTorrePorNomeECondominio(torre, condominio.id);
      if (!torreEncontrada) {
        return res.status(400).json({ erro: 'Torre inválida.' });
      }

      // 3. Validar apartamento
      const apartamentoEncontrado = await MoradoresModel.buscarApartamentoPorNumeroETorre(apartamento_numero, torreEncontrada.id);
      if (!apartamentoEncontrado) {
        return res.status(400).json({ erro: 'Apartamento inválido.' });
      }

      // 4. Criar morador com status pendente
      const morador = await MoradoresModel.criarViaWhatsApp({
        nome,
        whatsapp,
        apartamento_id: apartamentoEncontrado.id
      });

      res.status(201).json({ mensagem: 'Cadastro recebido, aguardando aprovação.', morador });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao criar cadastro via WhatsApp.' });
    }
  }

};

module.exports = MoradoresController;
