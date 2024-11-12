# Usa una imagen base de Node.js
FROM node:16

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el código fuente del proyecto
COPY . .

# Compila TypeScript
RUN npx tsc

# Expone el puerto en el que el servicio escuchará
EXPOSE 3000

# Ejecuta el archivo compilado
CMD ["node", "dist/index.js"]
