-- CreateTable
CREATE TABLE "Condominios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "plano" TEXT,
    "valor_plano" INTEGER NOT NULL,
    "quantidade_moradores" INTEGER NOT NULL DEFAULT 0,
    "observacao" TEXT,
    "contato_sindico" TEXT,
    "nome_sindico" TEXT,
    "data_vencimento" TIMESTAMP(3),
    "server_url_whatsapp" TEXT,
    "instancia_whatsapp" TEXT,
    "api_key_whatsapp" TEXT,

    CONSTRAINT "Condominios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sindicos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "condominio_id" INTEGER NOT NULL,

    CONSTRAINT "Sindicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Porteiros" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo_acesso" TEXT NOT NULL,
    "condominio_id" INTEGER NOT NULL,

    CONSTRAINT "Porteiros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Torres_Blocos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "condominio_id" INTEGER NOT NULL,

    CONSTRAINT "Torres_Blocos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apartamentos" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "torre_id" INTEGER NOT NULL,
    "condominiosId" INTEGER,

    CONSTRAINT "Apartamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Moradores" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "apartamento_id" INTEGER NOT NULL,
    "whatsapp" TEXT,

    CONSTRAINT "Moradores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encomendas" (
    "id" SERIAL NOT NULL,
    "codigo_retirada" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data_chegada" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "apartamento_id" INTEGER NOT NULL,
    "porteiro_id_checkin" INTEGER NOT NULL,
    "porteiro_id_checkout" INTEGER,
    "url_imagem" TEXT,
    "morador_id_encomenda" INTEGER NOT NULL,
    "morador_id_retirada" INTEGER,
    "data_retirada" TIMESTAMP(3),
    "condominiosId" INTEGER,

    CONSTRAINT "Encomendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacoes" (
    "id" SERIAL NOT NULL,
    "encomenda_id" INTEGER NOT NULL,
    "morador_id" INTEGER NOT NULL,
    "status_envio" TEXT NOT NULL DEFAULT 'pendente',
    "codigo_retirada" TEXT NOT NULL,

    CONSTRAINT "Notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sindicos_email_key" ON "Sindicos"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Sindicos_usuario_key" ON "Sindicos"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Porteiros_codigo_acesso_key" ON "Porteiros"("codigo_acesso");

-- CreateIndex
CREATE UNIQUE INDEX "Encomendas_codigo_retirada_key" ON "Encomendas"("codigo_retirada");

-- AddForeignKey
ALTER TABLE "Sindicos" ADD CONSTRAINT "Sindicos_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "Condominios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Porteiros" ADD CONSTRAINT "Porteiros_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "Condominios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Torres_Blocos" ADD CONSTRAINT "Torres_Blocos_condominio_id_fkey" FOREIGN KEY ("condominio_id") REFERENCES "Condominios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apartamentos" ADD CONSTRAINT "Apartamentos_torre_id_fkey" FOREIGN KEY ("torre_id") REFERENCES "Torres_Blocos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apartamentos" ADD CONSTRAINT "Apartamentos_condominiosId_fkey" FOREIGN KEY ("condominiosId") REFERENCES "Condominios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Moradores" ADD CONSTRAINT "Moradores_apartamento_id_fkey" FOREIGN KEY ("apartamento_id") REFERENCES "Apartamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encomendas" ADD CONSTRAINT "Encomendas_apartamento_id_fkey" FOREIGN KEY ("apartamento_id") REFERENCES "Apartamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encomendas" ADD CONSTRAINT "Encomendas_porteiro_id_checkin_fkey" FOREIGN KEY ("porteiro_id_checkin") REFERENCES "Porteiros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encomendas" ADD CONSTRAINT "Encomendas_porteiro_id_checkout_fkey" FOREIGN KEY ("porteiro_id_checkout") REFERENCES "Porteiros"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encomendas" ADD CONSTRAINT "Encomendas_morador_id_encomenda_fkey" FOREIGN KEY ("morador_id_encomenda") REFERENCES "Moradores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encomendas" ADD CONSTRAINT "Encomendas_morador_id_retirada_fkey" FOREIGN KEY ("morador_id_retirada") REFERENCES "Moradores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encomendas" ADD CONSTRAINT "Encomendas_condominiosId_fkey" FOREIGN KEY ("condominiosId") REFERENCES "Condominios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacoes" ADD CONSTRAINT "Notificacoes_encomenda_id_fkey" FOREIGN KEY ("encomenda_id") REFERENCES "Encomendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacoes" ADD CONSTRAINT "Notificacoes_morador_id_fkey" FOREIGN KEY ("morador_id") REFERENCES "Moradores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
