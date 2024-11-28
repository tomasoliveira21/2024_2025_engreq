# Use uma imagem base leve do Node.js
FROM node:18-alpine AS base

# Setar diretório de trabalho no contêiner
WORKDIR /app

# Copiar apenas os arquivos necessários para instalar dependências
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código para o contêiner
COPY . .

# Construir o projeto Next.js
RUN npm run build

# Expor a porta padrão do Next.js
EXPOSE 3000

# Comando para iniciar o servidor de produção do Next.js
CMD ["npm", "start"]
