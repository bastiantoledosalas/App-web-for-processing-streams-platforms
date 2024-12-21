# Usa una imagen oficial de Node.js como base
FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia únicamente los archivos necesarios para instalar las dependencias
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install --production

# Copia todo el código del frontend al contenedor, ignorando `node_modules` por defecto
COPY . .

# Expone el puerto en el que Next.js estará corriendo
EXPOSE 8000

# Comando para iniciar la aplicación en modo de desarrollo (en el puerto 8000)
CMD ["npm", "run", "dev"]
