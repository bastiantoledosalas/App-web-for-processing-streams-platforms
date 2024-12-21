# Usa una imagen base de Node.js
FROM node:16-alpine

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto 3004
EXPOSE 3004

# Comando para correr la aplicación
CMD ["npm", "run", "start:dev"]