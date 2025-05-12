const sharp = require('sharp');
const { supabase } = require('../config/supabase');

const uploadImagem = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ erro: 'Imagem não enviada' });

    // Verifica dimensões
    const metadata = await sharp(file.buffer).metadata();
    let pipeline = sharp(file.buffer);

    if (metadata.width > 1080) {
      pipeline = pipeline.resize({
        width: 1080,
        fit: sharp.fit.inside,
        withoutEnlargement: true
      });
    }

    // Comprimir para WebP
    const imagemComprimida = await pipeline
      .webp({
        quality: 80,             // Compressão equilibrada
        effort: 4,               // Nível de esforço (0–6), 4 = bom/rápido
        smartSubsample: true     // Melhora compressão em imagens com texto
      })
      .toBuffer();

    const nomeArquivo = `retirada-${Date.now()}.webp`;

    const { error } = await supabase.storage
      .from('condominio-bucket')
      .upload(nomeArquivo, imagemComprimida, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Erro no upload:', error);
      return res.status(500).json({ erro: 'Erro ao enviar imagem' });
    }

    const { publicUrl } = supabase
      .storage
      .from('condominio-bucket')
      .getPublicUrl(nomeArquivo).data;

    return res.status(200).json({ url: publicUrl });

  } catch (erro) {
    console.error('Erro geral no upload:', erro.message);
    return res.status(500).json({ erro: 'Erro interno ao processar imagem' });
  }
};

module.exports = { uploadImagem };
