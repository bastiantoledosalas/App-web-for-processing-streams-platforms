"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const amqplib_1 = __importDefault(require("amqplib"));
const app = (0, express_1.default)();
const port = 3000;
let channel, connection;
function connectRabbitMQ() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            connection = yield amqplib_1.default.connect('amqp://rabbitmq');
            channel = yield connection.createChannel();
            yield channel.assertQueue('hello', { durable: false });
        }
        catch (error) {
            console.error('Failed to connect to RabbitMQ:', error);
        }
    });
}
connectRabbitMQ();
app.use(express_1.default.json());
// Ruta para enviar un mensaje a RabbitMQ
app.post('/send', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = req.body.message || 'Hello RabbitMQ!';
        channel.sendToQueue('hello', Buffer.from(message));
        res.status(200).send('Message sent to RabbitMQ');
    }
    catch (error) {
        res.status(500).send('Failed to send message to RabbitMQ');
    }
}));
// Ruta para consumir mensajes de RabbitMQ
app.get('/consume', (req, res) => {
    try {
        channel.consume('hello', (msg) => {
            if (msg) {
                console.log('Received:', msg.content.toString());
                channel.ack(msg);
            }
        });
        res.status(200).send('Consuming messages from RabbitMQ');
    }
    catch (error) {
        res.status(500).send('Failed to consume messages from RabbitMQ');
    }
});
// Iniciar servidor
app.listen(port, () => {
    console.log(`RabbitMQ service listening at http://localhost:${port}`);
});
// Manejo de señales para cerrar la conexión a RabbitMQ de manera ordenada
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield channel.close();
    yield connection.close();
    console.log('RabbitMQ connection closed');
    process.exit(0);
}));
