import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';


// Configura dotenv
dotenv.config();

// Crea la instancia de la aplicación Express
const app = express();

// Define los puertos y la conexión a MongoDB desde el archivo .env
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || '';

// Conectar a la base de datos MongoDB usando Mongoose
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Conexión a MongoDB Atlas exitosa');
  })
  .catch((error: Error) => {
    console.error('Error de conexión a MongoDB Atlas:', error);
  });

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Definir una ruta de ejemplo
app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola desde el servicio de administración de MongoDB!');
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


