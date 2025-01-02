# Etapa de construcción
FROM node:16-alpine AS builder
WORKDIR /app


# Copia los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instala las dependencias del proyecto, incluyendo devDependencies
RUN npm install

# Instala la CLI de NestJS temporalmente en el entorno del builder
RUN npm install -g @nestjs/cli

# Copia el resto del código
COPY . .

# Compila el proyecto
RUN npm run build

# Etapa de Ejecución

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist   ./dist
RUN npm install --only=production --silent

# Expone el puerto 3002
EXPOSE 3002

# Comando para correr la aplicación
CMD ["node", "dist/main"]
