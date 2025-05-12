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
        apartamento: true,
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
};

module.exports = EncomendasModel;
