// src/models/condominiosModel.js
const prisma = require('../config/prisma');

const CondominiosModel = {
  async listarTodos() {
    return await prisma.condominios.findMany({
      orderBy: { nome: 'asc' }
    });
  },

  async buscarPorId(id) {
    return await prisma.condominios.findUnique({
      where: { id: Number(id) }
    });
  },

  async criar(dados) {
    return await prisma.condominios.create({
      data: dados
    });
  },

  async atualizar(id, dados) {
    return await prisma.condominios.update({
      where: { id: Number(id) },
      data: dados
    });
  },

  async deletar(id) {
    return await prisma.condominios.delete({
      where: { id: Number(id) }
    });
  },

  async buscarPorCodigoAcesso(codigo_acesso) {
    return await prisma.condominios.findUnique({
      where: { codigo_acesso }
    });
  },
};

module.exports = CondominiosModel;
