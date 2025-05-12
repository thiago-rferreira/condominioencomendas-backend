const sharp = require('sharp');
const { supabase } = require('../config/supabase');

const uploadImagem = async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).json({ erro: 'Imagem não enviada' });

    // 🧠 Compressão estilo WhatsApp
    const imagemComprimida = await sharp(file.buffer)
      .resize({
        width: 1080, // WhatsApp geralmente redimensiona para ~1080px
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .jpeg({
        quality: 80,              
        chromaSubsampling: '4:2:0', 
        mozjpeg: true             
      })
      .toBuffer();

    const nomeArquivo = `retirada-${Date.now()}.jpg`;

    const { data, error } = await supabase.storage
      .from('condominio-bucket')
      .upload(nomeArquivo, imagemComprimida, {
        contentType: 'image/jpeg',
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
