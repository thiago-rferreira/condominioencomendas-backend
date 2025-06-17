const prisma = require('../config/prisma');

const EncomendasModel = {
  async listarTodas() {
    return await prisma.encomendas.findMany({
      include: {
        apartamento: true,
        porteiro_checkin: true,
        morador_encomenda: true,
      },
    });
  },

  async buscarPorId(encomendaId) {
    return await prisma.encomendas.findUnique({
      where: { id: Number(encomendaId) },
      include: {
        apartamento: {
          select: {
            numero: true,
            torre: {
              select: {
                nome: true,
              },
            },
          },
        },
        porteiro_checkin: true,
        morador_encomenda: true,
      },
    });
  },

  async criarEncomenda(dadosEncomenda) {
    return await prisma.encomendas.create({
      data: dadosEncomenda,
    });
  },

  async atualizarEncomenda(encomendaId, novosDados) {
    return await prisma.encomendas.update({
      where: { id: Number(encomendaId) },
      data: novosDados,
    });
  },

  async deletarEncomenda(encomendaId) {
    return await prisma.encomendas.delete({
      where: { id: Number(encomendaId) },
    });
  },

  async buscarPorCondominio(condominioId) {
    return prisma.encomendas.findMany({
      where: {
        condominiosId: Number(condominioId)
      },
      select: {
        id: true,
        codigo_retirada: true,
        descricao: true,
        status: true,
        data_chegada: true,
        data_retirada: true,
        retirada_manual: true,
        url_imagem: true,
        imagem_retirada: true,
        apartamento: {
          select: {
            numero: true,
            id: true,
            torre: {
              select: {
                nome: true
              }
            }
          }
        },
        morador_encomenda: {
          select: { nome: true }
        },
        porteiro_checkin: {
          select: { nome: true }
        },
        porteiro_checkout: {
          select: { nome: true }
        } 
      }
    });
  }


};

module.exports = EncomendasModel;
