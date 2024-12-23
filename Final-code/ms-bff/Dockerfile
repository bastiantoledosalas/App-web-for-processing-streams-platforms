# Etapa de construcción
FROM node:18-alpine AS builder

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instala las dependencias del proyecto, incluyendo devDependencies
RUN npm install

# Instala la CLI de NestJS temporalmente en el entorno del builder
RUN npm install -g @nestjs/cli

# Copia todo el código del proyecto
COPY . .

# Compila el proyecto
RUN npm run build

# Etapa de Ejecución
FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Instala solo las dependencias de producción
RUN npm install --only=production --silent

# Expone el puerto en el que el BFF va a estar escuchando
EXPOSE 3000

# Comando para iniciar la aplicación en producción
CMD ["node", "dist/main"]
