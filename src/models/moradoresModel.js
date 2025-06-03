const prisma = require('../config/prisma');

const MoradoresModel = {
  async listarTodos() {
    return await prisma.moradores.findMany({
      include: {
        apartamento: {
          include: {
            torre: true // Traz os dados da torre associada ao apartamento
          }
        }
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
  },

  async listarPorApartamento(apartamentoId) {
    return await prisma.moradores.findMany({
      where: {
        apartamento_id: Number(apartamentoId)
      },
      orderBy: { nome: 'asc' }
    });
  },

  async buscarCondominioPorCodigo(codigo_acesso) {
    return await prisma.condominios.findUnique({
      where: { codigo_acesso }
    });
  },

  async buscarTorrePorNomeECondominio(nome, condominio_id) {
    return await prisma.torres_Blocos.findFirst({
      where: {
        nome,
        condominio_id
      }
    });
  },

  async buscarApartamentoPorNumeroETorre(numero, torre_id) {
    return await prisma.apartamentos.findFirst({
      where: {
        numero,
        torre_id
      }
    });
  },

  async criarViaWhatsApp({ nome, whatsapp, apartamento_id }) {
    return await prisma.moradores.create({
      data: {
        nome,
        whatsapp,
        status: 'pendente',
        apartamento_id
      }
    });
  },

  async buscarPorCondominio (condominio_id) {
    return await prisma.moradores.findMany({
      where: {
        apartamento: {
          torre: { condominio_id: Number(condominio_id) }
        }
      },
      include: {
        apartamento: {
          include: {
            torre: true
          }
        }
      },
      orderBy: { nome: 'asc' }
    });
  },

  async buscarPorTelefone (whatsapp) {
    if (!whatsapp) {
      throw new Error('Número de WhatsApp não fornecido.');
    }

    return await prisma.moradores.findFirst({
      where: { whatsapp: String(whatsapp) },
      include: {
        apartamento: {
          include: {
            torre: true
          }
        }
      }
    });
  }
};

module.exports = MoradoresModel;
