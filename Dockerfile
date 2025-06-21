# Utilise une image Node officielle (Debian pour éviter les erreurs de permission)
FROM node:18-bullseye

# Crée un répertoire de travail
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances (inclut Prisma CLI)
RUN npm install

# Copie le reste du code
COPY . .

# Exécute prisma generate sans erreur
RUN npx --yes prisma generate

# Expose le port
EXPOSE 5000

# Démarre l'application en prod (pas en mode dev !)
CMD ["npm", "start"]
