"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQConsumerFactory = void 0;
const RabbitMQConsumer_1 = require("./RabbitMQConsumer");
class RabbitMQConsumerFactory {
    constructor(deserializer, connection, maxRetries) {
        this.deserializer = deserializer;
        this.connection = connection;
        this.maxRetries = maxRetries;
    }
    build(subscriber, exchange, queueName) {
        return new RabbitMQConsumer_1.RabbitMQConsumer({
            subscriber,
            deserializer: this.deserializer,
            connection: this.connection,
            queueName,
            exchange,
            maxRetries: this.maxRetries
        });
    }
}
exports.RabbitMQConsumerFactory = RabbitMQConsumerFactory;
