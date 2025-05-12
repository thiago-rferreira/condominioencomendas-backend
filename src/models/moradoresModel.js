const prisma = require('../config/prisma');

const MoradoresModel = {
  async listarTodos() {
    return await prisma.moradores.findMany({
      include: {
        apartamento: true
      },
      orderBy: { nome: 'asc' }
    });
  },

  async buscarPorId(id) {
    return await prisma.moradores.findUnique({
      where: { id: Number(id) },
      include: {
        apartamento: true
      }
    });
  },

  async criar(dados) {
    return await prisma.moradores.create({ data: dados });
  },

  async atualizar(id, dados) {
    return await prisma.moradores.update({
      where: { id: Number(id) },
      data: dados
    });
  },

  async deletar(id) {
    return await prisma.moradores.delete({
      where: { id: Number(id) }
    });
  }
};

module.exports = MoradoresModel;
