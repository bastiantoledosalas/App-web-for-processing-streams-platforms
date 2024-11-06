# Usar una imagen base de Python
FROM python:3.11-slim

# Instalar dependencias del sistema necesarias para compilar y ejecutar el simulador
RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Crear un directorio de trabajo
WORKDIR /app

# Copiar el ejecutable del simulador y los archivos del servidor FastAPI
COPY Simulador /app/Simulador
COPY server.py /app/

# Instalar dependencias de Python (FastAPI y Uvicorn)
RUN pip install --no-cache-dir fastapi uvicorn

# Exponer el puerto que FastAPI utilizará
EXPOSE 8000

# Ejecutar el servidor FastAPI con uvicorn
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
