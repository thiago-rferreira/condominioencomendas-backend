// src/services/notificacaoService.js
const prisma = require('../config/prisma');
const evolutionModel = require('../models/evolutionModel');

function saudacaoPorHorario() {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia!☀️';
  if (hora < 18) return 'Boa tarde☀️';
  return 'Boa noite!🌙';
}

async function notificarMoradoresDoApartamento({
  encomenda,
  apartamentoId,
  moradorDestinatarioId,
  imagemUrl,
  codigoRetirada
}) {
  const moradores = await prisma.moradores.findMany({
    where: { apartamento_id: apartamentoId },
    select: { id: true, nome: true, whatsapp: true }
  });

  const destinatario = moradores.find(m => m.id === moradorDestinatarioId);
  const destinatarioNome = destinatario?.nome || 'morador';
  const saudacao = saudacaoPorHorario();

  for (const morador of moradores) {
    const paraQuem = morador.nome === destinatarioNome ? 'você' : `o(a) ${destinatarioNome}`;
    const mensagem = `${saudacao} ${morador.nome}, chegou uma encomenda 📦 para ${paraQuem}, o código de retirada é ${codigoRetirada}.`;

    const notificacao = await prisma.notificacoes.create({
      data: {
        encomenda_id: encomenda.id,
        morador_id: morador.id,
        codigo_retirada: codigoRetirada,
      },
    });

    if (morador.whatsapp) {
      try {
        await evolutionModel.sendOrderNotification(
          mensagem,
          imagemUrl,
          `55${morador.whatsapp}`,
          codigoRetirada,
          notificacao.id
        );

        await prisma.notificacoes.update({
          where: { id: notificacao.id },
          data: {
            status_envio: 'enviado',
            enviado_em: new Date(),
            tentativas: { increment: 1 }
          },
        });
      } catch (erroEnvio) {
        console.warn(`❗ Falha ao enviar para ${morador.nome}:`, erroEnvio.response?.data || erroEnvio.message);
      }
    } else {
      console.warn(`⚠️ Morador ${morador.nome} não possui WhatsApp cadastrado.`);
    }
  }
}

module.exports = {
  notificarMoradoresDoApartamento,
};