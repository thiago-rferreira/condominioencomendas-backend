const validacaoModel = require('./../models/validacaoModel');
const crypto = require('crypto');
const evolutionModel = require('./../models/evolutionModel');

function gerarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // ex: "123456"
}

exports.solicitarCodigo = async (req, res) => {
  const { whatsapp } = req.body;
  if (!whatsapp) return res.status(400).json({ error: 'WhatsApp é obrigatório' });

  const token = crypto.randomBytes(16).toString('hex');
  const codigo = gerarCodigo();
  const expiradoEm = new Date(Date.now() + 10 * 60000); // expira em 10 minutos
  const mensagem = `Seu código de validação é: ${codigo}. Ele é válido por 10 minutos.`;

  try {
    await validacaoModel.criarValidacao({ token, codigo, whatsapp, expiradoEm });
    await evolutionModel.sendMessage(mensagem, `55${whatsapp}`);
    return res.json({ token, message: 'Código enviado para seu WhatsApp' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao gerar ou enviar código' });
  }
};

exports.confirmarCodigo = async (req, res) => {
  const { token, codigo } = req.body;
  if (!token || !codigo) return res.status(400).json({ error: 'Token e código são obrigatórios' });

  const registro = await validacaoModel.buscarPorToken(token);
  if (!registro) return res.status(404).json({ error: 'Token não encontrado' });

  if (registro.status !== 'pendente') return res.status(400).json({ error: 'Código já utilizado' });

  if (registro.expiradoEm < new Date()) return res.status(400).json({ error: 'Código expirado' });

  if (registro.codigo !== codigo) return res.status(400).json({ error: 'Código incorreto' });

  await validacaoModel.marcarComoUsado(registro.id);

  return res.json({ success: true, message: 'WhatsApp validado com sucesso' });
};
