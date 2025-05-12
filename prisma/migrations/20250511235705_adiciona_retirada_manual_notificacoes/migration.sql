-- AlterTable
ALTER TABLE "Encomendas" ADD COLUMN     "imagem_retirada" TEXT,
ADD COLUMN     "retirada_manual" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Notificacoes" ADD COLUMN     "enviado_em" TIMESTAMP(3),
ADD COLUMN     "erro_envio" TEXT,
ADD COLUMN     "tentativas" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tipo_envio" TEXT NOT NULL DEFAULT 'whatsapp';
