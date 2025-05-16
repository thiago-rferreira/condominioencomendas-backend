const prisma = require('../config/prisma');


module.exports = {
  async criarValidacao({ token, codigo, whatsapp, expiradoEm }) {
    return prisma.validacaoWhatsapp.create({
      data: {
        token,
        codigo,
        whatsapp,
        expiradoEm,
      },
    });
  },

  async buscarPorToken(token) {
    return prisma.validacaoWhatsapp.findUnique({ where: { token } });
  },

  async marcarComoUsado(id) {
    return prisma.validacaoWhatsapp.update({
      where: { id },
      data: { status: 'usado' },
    });
  },
};
