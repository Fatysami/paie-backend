# Utilise une image Node officielle
FROM node:18

# Crée un répertoire de travail
WORKDIR /app

# Copie les fichiers package.json et install
COPY package*.json ./
RUN npm install

# Copie le reste du code source
COPY . .

# Génère Prisma Client
RUN npx prisma generate

# Expose le port backend
EXPOSE 5000

# Commande de démarrage
CMD ["npm", "run", "dev"]
