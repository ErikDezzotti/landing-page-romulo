FROM node:18-alpine

WORKDIR /app

# Copiar apenas os arquivos de dependência primeiro
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar o resto dos arquivos
COPY . .

# Expor a porta 80
EXPOSE 80

# Definir variável de ambiente
ENV NODE_ENV=production
ENV PORT=80

# Comando para iniciar o servidor
CMD ["node", "server.js"]