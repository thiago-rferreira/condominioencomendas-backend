const prisma = require('../config/prisma');

const ApartamentosModel = {
  async listarTodos() {
    return await prisma.apartamentos.findMany({
      include: {
        torre: true,
        Condominios: true  
      },
      orderBy: { numero: 'asc' }
    });
  },

  async buscarPorId(id) {
    return await prisma.apartamentos.findUnique({
      where: { id: Number(id) },
      include: {
        torre: true,
        Condominios: true  
      }
    });
  },

  async criar(dados) {
    return await prisma.apartamentos.create({ data: dados });
  },

  async atualizar(id, dados) {
    return await prisma.apartamentos.update({
      where: { id: Number(id) },
      data: dados
    });
  },

  async deletar(id) {
    return await prisma.apartamentos.delete({
      where: { id: Number(id) }
    });
  }
};

module.exports = ApartamentosModel;
