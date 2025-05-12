# Base da imagem
FROM node:18

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todos os arquivos do projeto
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Expõe a porta do app
EXPOSE 3000

# Inicia o servidor (ajustado para a estrutura com src)
CMD ["node", "src/app.js"]
