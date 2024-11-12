"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Configura dotenv
dotenv_1.default.config();
// Crea la instancia de la aplicación Express
const app = (0, express_1.default)();
// Define los puertos y la conexión a MongoDB desde el archivo .env
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || '';
// Conectar a la base de datos MongoDB usando Mongoose
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    console.log('Conexión a MongoDB Atlas exitosa');
})
    .catch((error) => {
    console.error('Error de conexión a MongoDB Atlas:', error);
});
// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express_1.default.json());
// Definir una ruta de ejemplo
app.get('/', (req, res) => {
    res.send('¡Hola desde el servicio de administración de MongoDB!');
});
// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
