const axios = require('axios');
const QRCode = require('qrcode');  
require('dotenv').config();  // Carregar as variáveis de ambiente

// Carregar variáveis de ambiente
const apikey = process.env.API_KEY;
const serverUrl = process.env.SERVER_URL;
const instanceId = process.env.INSTANCE;

// Função para enviar mensagem com texto para um destinatário específico e instância
const sendMessage = async (message, recipientNumber) => {
  const url = `${serverUrl}/message/sendText/${instanceId}`;  // URL com base no server-url e instance

  const body = {
    number: recipientNumber,  // Número do destinatário
    text: message,  // Texto da mensagem
  };

  const options = {
    method: 'POST',
    headers: {
      'apikey': apikey,  // Chave da API
      'Content-Type': 'application/json',
    },
    data: body,
  };

  try {
    const response = await axios(url, options);  // Usando o axios para fazer a requisição
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error.response ? error.response.data : error);
    throw error;
  }
};

// Função para enviar mensagem com imagem (usando URL da imagem) para um destinatário específico e instância
const sendMessageWithImage = async (message, imageUrl, recipientNumber) => {
  const url = `${serverUrl}/message/sendMedia/${instanceId}`;  // URL com base no server-url e instance

  const body = {
    number: recipientNumber,
    mediatype: "image",           // Tipo de mídia
    mimetype: "image/png",        // Tipo MIME
    caption: message,             // Texto (legenda)
    media: imageUrl,              // URL da imagem
    fileName: "Imagem.png",       // Nome do arquivo
    options: {
      delay: 2500,                // Atraso em milissegundos
      presence: "composing"       // (opcional) simula que está digitando
    }
  };

  const options = {
    method: 'POST',
    headers: {
      'apikey': apikey,  // Chave da API
      'Content-Type': 'application/json',
    },
    data: body,
  };

  try {
    const response = await axios(url, options);  // Usando o axios para fazer a requisição
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem com imagem:', error.response ? error.response.data : error);
    throw error;
  }
};

const generateQRCode = async (text) => {
  try {
    let qrCodeImage = await QRCode.toDataURL(text); // Gera o QR Code como base64

    //Limpar base64
    qrCodeImage = qrCodeImage.replace(/^data:image\/png;base64,/, ''); // Remove o prefixo base64

    return qrCodeImage;  // Retorna a imagem gerada como base64
  } catch (error) {
    console.error("Erro ao gerar o QR Code:", error);
    throw error;
  }
};

const sendQRCode = async (message, code, recipientNumber, qrCodeImage) => {
  message = null;
  const url = `${serverUrl}/message/sendMedia/${instanceId}`;

  //limpar base64
  qrCodeImage = qrCodeImage.replace(/^data:image\/png;base64,/, ''); // Remove o prefixo base64

  const body = {
    number: recipientNumber,
    caption: message ? `${message}, e o seu código para retirada é: ${code}` : `Código de retirada: ${code}`,  // Mensagem a ser enviada
    media: qrCodeImage,  // Passando a imagem gerada do QR Code
    mediatype: 'image',  // Tipo de mídia
    mimetype: 'image/png',  // Tipo MIME da imagem
    fileName: 'qrcode.png',  // Nome do arquivo da imagem
  };

  const options = {
    method: 'POST',
    headers: {
      'apikey': apikey,
      'Content-Type': 'application/json',
    },
    data: body,
  };

  try {
    const response = await axios(url, options);  // Usando o axios para fazer a requisição
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem com QR Code:', error.response ? error.response.data : error);
    throw error;
  }
};

//Execute primeiro send MessageWithImage e depois execute sendQRCode
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sendOrderNotification = async (message, imageUrl, recipientNumber, code, notificationId) => {
  try {
    if (!recipientNumber) {
      throw new Error('Número de destinatário não fornecido.');
    }
   
    if (!code) {
      throw new Error('Código não fornecido.');
    }
    if (!notificationId) {
      throw new Error('ID da notificação não fornecido.');
    }
    if (!imageUrl) {
      imageUrl = 'https://pics.freeicons.io/uploads/icons/png/1012350441642851859-512.png'; 
    }
    // 1. Enviar mensagem com imagem
    const imageResponse = await sendMessageWithImage(message, imageUrl, recipientNumber);

    await delay(1000); // Espera 1 segundo

    // 2. Gerar QR Code
    const qrCodeImage = await generateQRCode(code);


    await delay(1000); // Espera 1 segundo

    // 3. Enviar o QR Code
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
