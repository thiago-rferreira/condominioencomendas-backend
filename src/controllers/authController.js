const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo-muito-forte-QDKFJSFKSDJFLSKJDFLSKDFJ';

const login = async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({ erro: 'Usuário e senha são obrigatórios.' });
    }

    const sindico = await prisma.sindicos.findUnique({
      where: { usuario },
      include: { condominio: true }
    });

    const senhaValida = await bcrypt.compare(senha, sindico?.senha || '');

    if (!sindico || !senhaValida) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
    }

    // Gera o JWT
    const token = jwt.sign(
      {
        id: sindico.id,
        nome: sindico.nome,
        usuario: sindico.usuario,
        condominio_id: sindico.condominio_id
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      usuario: {
        id: sindico.id,
        nome: sindico.nome,
        usuario: sindico.usuario,
        condominio: sindico.condominio
      },
      token
    });

  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao realizar login.' });
  }
};

const me = (req, res) => {
  res.json(req.usuario);
};

module.exports = { login, me };
