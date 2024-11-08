"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQEventBusFactory = void 0;
const RabbitMQEventBus_1 = require("../../../../Shared/infrastructure/EventBus/RabbitMQ/RabbitMQEventBus");
class RabbitMQEventBusFactory {
    static create(failoverPublisher, connection, queueNameFormatter, config) {
        return new RabbitMQEventBus_1.RabbitMQEventBus({
            failoverPublisher,
            connection,
            exchange: config.exchangeSettings.name,
            queueNameFormatter: queueNameFormatter,
            maxRetries: config.maxRetries
        });
    }
}
exports.RabbitMQEventBusFactory = RabbitMQEventBusFactory;
