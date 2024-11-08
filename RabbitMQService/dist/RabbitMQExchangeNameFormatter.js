"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQExchangeNameFormatter = void 0;
class RabbitMQExchangeNameFormatter {
    static retry(exchangeName) {
        return `retry-${exchangeName}`;
    }
    static deadLetter(exchangeName) {
        return `dead_letter-${exchangeName}`;
    }
}
exports.RabbitMQExchangeNameFormatter = RabbitMQExchangeNameFormatter;
