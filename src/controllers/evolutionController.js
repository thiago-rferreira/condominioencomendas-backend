const evolutionModel = require('../models/evolutionModel');

// Controlador para enviar mensagem com texto para um destinatário específico e instância
const sendMessage = async (req, res) => {
  try {
    const { message, recipientNumber } = req.body;  // Mensagem e número do destinatário
    if (!recipientNumber) {
      return res.status(400).json({ message: 'O número do destinatário é obrigatório' });
    }

    const data = await evolutionModel.sendMessage(message, recipientNumber);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar mensagem', error });
  }
};

// Controlador para enviar mensagem com imagem para um destinatário específico e instância
const sendMessageWithImage = async (req, res) => {
  try {
    const { message, imageUrl, recipientNumber } = req.body;  // Mensagem, URL da imagem, número e instância
    if (!recipientNumber || !imageUrl) {
      return res.status(400).json({ message: 'A URL da imagem e o número do destinatário são obrigatórios' });
    }

    const data = await evolutionModel.sendMessageWithImage(message, imageUrl, recipientNumber);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar mensagem com imagem', error });
  }
};

const sendQRCode = async (req, res) => {
  try {
    const { code, recipientNumber, message } = req.body;  // Código e número do destinatário


    if (!code || !recipientNumber) {
      return res.status(400).json({ message: 'O código e o número do destinatário são obrigatórios' });
    }

    // Gerar o QR Code com a string fornecida
    const qrCodeImage = await evolutionModel.generateQRCode(code);

    // Enviar o QR Code como imagem via Evolution API
    const data = await evolutionModel.sendQRCode(message, code, recipientNumber, qrCodeImage);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar QR Code', error });
  }
};

const sendOrderNotification = async (req, res) => {
  try {
    const {message, imageUrl, recipientNumber, code} = req.body;  // Mensagem, URL da imagem, número e instância

    if (!recipientNumber || !imageUrl || !code || !message) {
      return res.status(400).json({ message: 'Voce deve enviar code, recipientNumber, imageUrl, message' });
    }

    // usar o modelo para enviar a mensagem
    const data = await evolutionModel.sendOrderNotification(message, imageUrl, recipientNumber, code);
    res.status(200).json(data);
    
  } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar a notificacao', error });  
  }
}

const sendMassNotification = async (req, res) => {
  try {
    const randomCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();    // Ex: 4F6XK2
    const randomMessage = (i) => `🚀 Mensagem teste #${i + 1} - ${Math.random().toString(36).substring(2, 5)}`;
    const randomImage = () => `https://picsum.photos/200?random=${Math.floor(Math.random() * 1000)}`;

    // Criar 100 promessas com dados aleatórios
    const promises = Array.from({ length: 5 }).map((_, i) =>
      evolutionModel.sendOrderNotification(
        randomMessage(i),
        randomImage(),
        "5519996512448",
        randomCode()
      )
    );

    const results = await Promise.all(promises);

    res.status(200).json({
      message: '10 notificações de teste enviadas com sucesso!',
      resultsCount: results.length
    });

  } catch (error) {
    console.error('Erro no envio em massa aleatório:', error);
    res.status(500).json({ message: 'Erro ao enviar notificações aleatórias', error });
  }
};



module.exports = {
  sendMessage,
  sendMessageWithImage,
  sendQRCode,
  sendOrderNotification,
  sendMassNotification
};
