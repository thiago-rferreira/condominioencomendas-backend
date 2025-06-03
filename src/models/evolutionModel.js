const axios = require('axios');
const QRCode = require('qrcode');
require('dotenv').config();  // Carregar as variáveis de ambiente

// Carregar variáveis de ambiente
const apikey = process.env.API_KEY;
const serverUrl = process.env.SERVER_URL;
const instanceId = process.env.INSTANCE;

// Importar diretamente o objeto do model (não o controller)
const MoradoresModel = require('./moradoresModel');  // ajuste o caminho conforme sua pasta

// Função para enviar mensagem com texto para um destinatário específico e instância
const sendMessage = async (message, recipientNumber) => {
  const url = `${serverUrl}/message/sendText/${instanceId}`;
  const body = { number: recipientNumber, text: message };
  const options = {
    method: 'POST',
    headers: { 'apikey': apikey, 'Content-Type': 'application/json' },
    data: body,
  };
  try {
    const response = await axios(url, options);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error.response ? error.response.data : error);
    throw error;
  }
};

// Função para enviar mensagem com imagem (usando URL da imagem)
const sendMessageWithImage = async (message, imageUrl, recipientNumber) => {
  const url = `${serverUrl}/message/sendMedia/${instanceId}`;
  const body = {
    number: recipientNumber,
    mediatype: "image",
    mimetype: "image/png",
    caption: message,
    media: imageUrl,
    fileName: "Imagem.png",
    options: { delay: 2500, presence: "composing" }
  };
  const options = {
    method: 'POST',
    headers: { 'apikey': apikey, 'Content-Type': 'application/json' },
    data: body,
  };
  try {
    const response = await axios(url, options);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem com imagem:', error.response ? error.response.data : error);
    throw error;
  }
};

const generateQRCode = async (text) => {
  try {
    let qrCodeImage = await QRCode.toDataURL(text);
    qrCodeImage = qrCodeImage.replace(/^data:image\/png;base64,/, '');
    return qrCodeImage;
  } catch (error) {
    console.error("Erro ao gerar o QR Code:", error);
    throw error;
  }
};

const sendQRCode = async (message, code, recipientNumber, qrCodeImage) => {
  message = null;
  const url = `${serverUrl}/message/sendMedia/${instanceId}`;
  qrCodeImage = qrCodeImage.replace(/^data:image\/png;base64,/, '');
  const body = {
    number: recipientNumber,
    caption: message 
      ? `${message}, e o seu código para retirada é: ${code}` 
      : `Código de retirada: ${code}`,
    media: qrCodeImage,
    mediatype: 'image',
    mimetype: 'image/png',
    fileName: 'qrcode.png',
  };
  const options = {
    method: 'POST',
    headers: { 'apikey': apikey, 'Content-Type': 'application/json' },
    data: body,
  };
  try {
    const response = await axios(url, options);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem com QR Code:', error.response ? error.response.data : error);
    throw error;
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sendOrderNotification = async (message, imageUrl, recipientNumber, code, notificationId) => {
  try {
    if (!recipientNumber) throw new Error('Número de destinatário não fornecido.');
    if (!code) throw new Error('Código não fornecido.');
    if (!notificationId) throw new Error('ID da notificação não fornecido.');
    if (!imageUrl) {
      imageUrl = 'https://pics.freeicons.io/uploads/icons/png/1012350441642851859-512.png';
    }

    // 1. Enviar mensagem com imagem inicial
    const imageResponse = await sendMessageWithImage(message, imageUrl, recipientNumber);
    await delay(1000);

    // 2. Buscar dados do morador pelo número de WhatsApp chamando o método do model
    const moradorData = await MoradoresModel.buscarPorTelefone(recipientNumber);
    if (!moradorData) {
      throw new Error(`Morador com telefone ${recipientNumber} não encontrado.`);
    }

    // 3. Montar payload JSON contendo código e dados do morador
    const qrPayload = JSON.stringify({
      codigo: code,
      morador: {
        id: moradorData.id,
        nome: moradorData.nome,
        apartamento_id: moradorData.apartamento_id,
        whatsapp: moradorData.whatsapp,
        status: moradorData.status,
        apartamento_numero: moradorData.apartamento?.numero,
        torre_id: moradorData.apartamento?.torre?.id,
        torre_nome: moradorData.apartamento?.torre?.nome,
        condominiosId: moradorData.apartamento?.condominiosId
      }
    });

    // 4. Gerar QR Code a partir do payload completo
    const qrCodeImage = await generateQRCode(qrPayload);
    await delay(1000);

    // 5. Enviar o QR Code gerado
    const qrCodeResponse = await sendQRCode(message, code, recipientNumber, qrCodeImage);

    return { imageResponse, qrCodeResponse, notificationId };

  } catch (error) {
    console.error('Erro ao enviar imagem e QR Code:', error);
    throw error;
  }
};

module.exports = {
  sendMessage,
  sendMessageWithImage,
  generateQRCode,
  sendQRCode,
  sendOrderNotification
};
