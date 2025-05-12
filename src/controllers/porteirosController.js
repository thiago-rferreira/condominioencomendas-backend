const PorteirosModel = require('../models/porteirosModel');
const prisma = require('../config/prisma');


const gerarCodigoUnico = async () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    const gerar = () => {
        let codigo = '';
        for (let i = 0; i < 6; i++) {
            codigo += caracteres[Math.floor(Math.random() * caracteres.length)];
        }
        return codigo;
    };

    let codigo;
    let existe;
    let tentativas = 0;

    do {
        if (tentativas++ > 10) throw new Error('Falha ao gerar código único para o porteiro.');
        codigo = gerar();
        existe = await prisma.porteiros.findUnique({ where: { codigo_acesso: codigo } });
    } while (existe);

    return codigo;
};

const PorteirosController = {
    async listar(req, res) {
        try {
            const lista = await PorteirosModel.listarTodos();
            res.json(lista);
        } catch (erro) {
            res.status(500).json({ erro: 'Erro ao listar porteiros.' });
        }
    },

    async buscar(req, res) {
        try {
            const { id } = req.params;
            const porteiro = await PorteirosModel.buscarPorId(id);
            if (!porteiro) return res.status(404).json({ erro: 'Porteiro não encontrado.' });
            res.json(porteiro);
        } catch (erro) {
            res.status(500).json({ erro: 'Erro ao buscar porteiro.' });
        }
    },

    async criar(req, res) {
        try {
            const { nome, condominio_id } = req.body;
        
            if (!nome || !condominio_id) {
              return res.status(400).json({ erro: 'nome e condominio_id são obrigatórios.' });
            }
        
            const codigo_acesso = await gerarCodigoUnico();
        
            const novo = await PorteirosModel.criar({
              nome,
              codigo_acesso,
              condominio_id
            });
        
            res.status(201).json(novo);
          } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: 'Erro ao criar porteiro.', detalhes: erro.message });
          }
    },

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const atualizado = await PorteirosModel.atualizar(id, req.body);
            res.json(atualizado);
        } catch (erro) {
            res.status(500).json({ erro: 'Erro ao atualizar porteiro.' });
        }
    },

    async deletar(req, res) {
        try {
            const { id } = req.params;
            await PorteirosModel.deletar(id);
            res.json({ mensagem: 'Porteiro removido com sucesso.' });
        } catch (erro) {
            res.status(500).json({ erro: 'Erro ao deletar porteiro.' });
        }
    },

    async buscarPorCodigo(req, res) {
        try {
            const { codigo } = req.params;
            const porteiro = await PorteirosModel.buscarPorCodigo(codigo);
            if (!porteiro) return res.status(404).json({ erro: 'Porteiro não encontrado.' });
            res.json(porteiro);
        } catch (erro) {
            res.status(500).json({ erro: 'Erro ao buscar porteiro.' });
        }
    }
};

module.exports = PorteirosController;
