const EncomendasModel = require('../models/encomendasModel');
const prisma = require('../config/prisma');
const { notificarMoradoresDoApartamento } = require('../services/notificacaoService');

const gerarCodigoUnico = async () => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const gerar = () => {
    let codigo = '';
    for (let i = 0; i < 6; i++) {
      const rand = Math.floor(Math.random() * caracteres.length);
      codigo += caracteres[rand];
    }
    return codigo;
  };

  let codigo;
  let existe;
  let tentativas = 0;

  do {
    if (tentativas++ > 10) throw new Error('Falha ao gerar código único após 10 tentativas.');
    codigo = gerar();
    existe = await prisma.encomendas.findUnique({ where: { codigo_retirada: codigo } });
  } while (existe);

  return codigo;
};

const EncomendasController = {
  
  async listar(req, res) {
    try {
      const lista = await EncomendasModel.listarTodas();
      res.json(lista);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao listar encomendas.', erro });
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

      const camposObrigatorios = [
        'descricao',
        'data_chegada',
        'apartamento_id',
        'porteiro_id_checkin',
        'morador_id_encomenda',
        'url_imagem'
      ];
      for (const campo of camposObrigatorios) {
        if (!dados[campo]) {
          return res.status(400).json({ erro: `O campo '${campo}' é obrigatório.` });
        }
      }

      const codigoGerado = await gerarCodigoUnico();

      const novaEncomenda = await prisma.encomendas.create({
        data: {
          codigo_retirada: codigoGerado,
          descricao: dados.descricao,
          data_chegada: new Date(dados.data_chegada),
          apartamento_id: dados.apartamento_id,
          porteiro_id_checkin: dados.porteiro_id_checkin,
          morador_id_encomenda: dados.morador_id_encomenda,
          url_imagem: dados.url_imagem,
          condominiosId: dados.condominiosId || null
        },
      });

      // 🔁 Responde ao porteiro imediatamente
      res.status(201).json(novaEncomenda);

      // ▶️ Notificações enviadas em segundo plano
      setImmediate(() => {
        notificarMoradoresDoApartamento({
          encomenda: novaEncomenda,
          apartamentoId: dados.apartamento_id,
          moradorDestinatarioId: dados.morador_id_encomenda,
          imagemUrl: dados.url_imagem,
          codigoRetirada: codigoGerado
        }).catch(err => {
          console.error('❗Erro ao enviar notificações em segundo plano:', err.message);
        });
      });

    } catch (erro) {
      console.error(erro);
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

 async buscarPorCondominio(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ erro: 'É necessário informar o ID do condomínio.' });
      }

      const encomendas = await EncomendasModel.buscarPorCondominio(id);
      res.json(encomendas);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao buscar encomendas por condomínio.' });
    }
  }
};

module.exports = EncomendasController;
