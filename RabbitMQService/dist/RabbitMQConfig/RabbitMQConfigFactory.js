"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQConfigFactory = void 0;
class RabbitMQConfigFactory {
    static createConfig() {
        return {
            connectionSettings: {
                host: process.env.RABBITMQ_HOST || 'localhost',
                port: parseInt(process.env.RABBITMQ_PORT || '5672'),
                username: process.env.RABBITMQ_USERNAME || 'guest',
                password: process.env.RABBITMQ_PASSWORD || 'guest'
            },
            exchangeSettings: {
                name: process.env.RABBITMQ_EXCHANGE || 'default_exchange'
            },
            maxRetries: parseInt(process.env.RABBITMQ_MAX_RETRIES || '5'),
            retryTtl: parseInt(process.env.RABBITMQ_RETRY_TTL || '60000')
        };
    }
}
exports.RabbitMQConfigFactory = RabbitMQConfigFactory;
