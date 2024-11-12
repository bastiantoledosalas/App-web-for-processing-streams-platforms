import express from 'express';
import amqplib, { Channel, Connection } from 'amqplib';

const app = express();
const port = 3000;

let channel: Channel, connection: Connection;

async function connectRabbitMQ() {
  try {
    connection = await amqplib.connect('amqp://rabbitmq');
    channel = await connection.createChannel();
    await channel.assertQueue('hello', { durable: false });
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
}

connectRabbitMQ();

app.use(express.json());

// Ruta para enviar un mensaje a RabbitMQ
app.post('/send', async (req, res) => {
  try {
    const message = req.body.message || 'Hello RabbitMQ!';
    channel.sendToQueue('hello', Buffer.from(message));
    res.status(200).send('Message sent to RabbitMQ');
  } catch (error) {
    res.status(500).send('Failed to send message to RabbitMQ');
  }
});

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
  } catch (error) {
    res.status(500).send('Failed to consume messages from RabbitMQ');
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`RabbitMQ service listening at http://localhost:${port}`);
});

// Manejo de señales para cerrar la conexión a RabbitMQ de manera ordenada
process.on('SIGINT', async () => {
  await channel.close();
  await connection.close();
  console.log('RabbitMQ connection closed');
  process.exit(0);
});
