FROM node:18-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ❌ Supprime cette ligne cassante
# RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]
