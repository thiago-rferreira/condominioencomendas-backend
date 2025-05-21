// models/indicadoresModel.js
const prisma = require('../config/prisma');

const IndicadoresModel = {
  async buscarIndicadores(condominioId) {
    // Quantidade de Encomendas Armazenadas
    const encomendasArmazenadas = await prisma.encomendas.count({
      where: {
        condominiosId: Number(condominioId),
        status: 'pendente', // Supondo que 'armazenada' seja um status válido
      },
    });

    // Quantidade de Encomendas Entregues
    const encomendasEntregues = await prisma.encomendas.count({
      where: {
        condominiosId: Number(condominioId),
        status: 'retirada', // Supondo que 'entregue' seja um status válido
      },
    });

    // Quantidade de Porteiros Cadastrados
    const porteirosCadastrados = await prisma.porteiros.count({
      where: {
        condominio_id: Number(condominioId),
      },
    });

    // Quantidade de Moradores Cadastrados
    const moradoresCadastrados = await prisma.moradores.count({
      where: {
        status: 'ativo',
        apartamento: {
            condominiosId: Number(condominioId),
        },
      },
    });

    const moradoresPendentes = await prisma.moradores.count({
      where: {
        status: 'pendente',
        apartamento: {
            condominiosId: Number(condominioId),
        },
      },
    });

    // Quantidade de Apartamentos
    const apartamentos = await prisma.apartamentos.count({
      where: {
        condominiosId: Number(condominioId),
      },
    });

    // Quantidade de Torres
    const torres = await prisma.torres_Blocos.count({
      where: {
        condominio_id: Number(condominioId),
      },
    });

    // Taxa de Entrega (%)
    const totalEncomendas = encomendasArmazenadas + encomendasEntregues;
    const taxaEntrega = totalEncomendas > 0 ? parseFloat(((encomendasEntregues / totalEncomendas) * 100).toFixed(2)) : 0;

    // Média de Moradores por Apartamento
    const mediaMoradoresApartamento = apartamentos > 0 ? parseFloat((moradoresCadastrados / apartamentos).toFixed(2)) : 0;

    // Trazer codigo_acesso do condominio 
    const condominio = await prisma.condominios.findUnique({
      where: {
        id: Number(condominioId),
      },
      select: {
        codigo_acesso: true,
      },
    });

    return {
      encomendasArmazenadas,
      encomendasEntregues,
      porteirosCadastrados,
      moradoresCadastrados,
      apartamentos,
      torres,
      taxaEntrega,
      mediaMoradoresApartamento,
      moradoresPendentes,
      condominio
    };
  },
};

module.exports = IndicadoresModel;
