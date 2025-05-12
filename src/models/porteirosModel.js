const prisma = require('../config/prisma');

const PorteirosModel = {
  async listarTodos() {
    return await prisma.porteiros.findMany({
      include: { condominio: true },
      orderBy: { nome: 'asc' }
    });
  },

  async buscarPorId(id) {
    return await prisma.porteiros.findUnique({
      where: { id: Number(id) },
      include: { condominio: true }
    });
  },

  async criar(dados) {
    return await prisma.porteiros.create({ data: dados });
  },

  async atualizar(id, dados) {
    return await prisma.porteiros.update({
      where: { id: Number(id) },
      data: dados
    });
  },

  async deletar(id) {
    return await prisma.porteiros.delete({
      where: { id: Number(id) }
    });
  }
};

module.exports = PorteirosModel;
