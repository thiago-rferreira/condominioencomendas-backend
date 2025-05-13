const prisma = require('../config/prisma');

const TorresModel = {
  async listarTodos() {
    return await prisma.torres_Blocos.findMany({
      include: { condominio: true },
      orderBy: { nome: 'asc' }
    });
  },

  async buscarPorId(id) {
    return await prisma.torres_Blocos.findUnique({
      where: { id: Number(id) },
      include: { condominio: true }
    });
  },

  async criar(dados) {
    return await prisma.torres_Blocos.create({ data: dados });
  },

  async atualizar(id, dados) {
    return await prisma.torres_Blocos.update({
      where: { id: Number(id) },
      data: dados
    });
  },

  async deletar(id) {
    return await prisma.torres_Blocos.delete({
      where: { id: Number(id) }
    });
  },
  async buscarPorCondominio(condominio_id) {
    return await prisma.torres_Blocos.findMany({
      where: { condominio_id: Number(condominio_id) },
      include: { condominio: false }
    });
  }
};

module.exports = TorresModel;
