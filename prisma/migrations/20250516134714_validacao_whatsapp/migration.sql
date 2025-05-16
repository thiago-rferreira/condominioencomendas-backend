-- CreateTable
CREATE TABLE "ValidacaoWhatsapp" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiradoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValidacaoWhatsapp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ValidacaoWhatsapp_token_key" ON "ValidacaoWhatsapp"("token");
