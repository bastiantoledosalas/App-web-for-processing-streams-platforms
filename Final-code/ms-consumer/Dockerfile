# Usa una imagen con glibc >= 2.29
FROM debian:bullseye-slim

# Instala Node.js manualmente
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto 3005
EXPOSE 3005

# Comando para correr la aplicación
CMD ["npm", "run", "start:dev"]