# Base da imagem
FROM node:18

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos
COPY package*.json ./
RUN npm install

COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Expõe a porta do app (ajuste se for diferente)
EXPOSE 3000

# Inicia o servidor
CMD ["node", "src/app.js"]
