# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de tu proyecto al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Expón el puerto que la app usará
EXPOSE 3000

# Define el comando para ejecutar la app
CMD ["node", "server.ts"]
