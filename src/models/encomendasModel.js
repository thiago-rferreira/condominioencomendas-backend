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
    const novaEncomenda = await prisma.encomendas.create({
      data: dadosEncomenda,
    });

    await prisma.notificacoes.create({
      data: {
        encomenda_id: novaEncomenda.id,
        morador_id: novaEncomenda.morador_id_encomenda,
        codigo_retirada: novaEncomenda.codigo_retirada,
      },
    });

    return novaEncomenda;
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
