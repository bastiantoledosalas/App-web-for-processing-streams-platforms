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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQConfigurer = void 0;
const RabbitMQExchangeNameFormatter_1 = require("./RabbitMQExchangeNameFormatter");
class RabbitMQConfigurer {
    constructor(connection, queueNameFormatter, messageRetryTtl) {
        this.connection = connection;
        this.queueNameFormatter = queueNameFormatter;
        this.messageRetryTtl = messageRetryTtl;
    }
    configure(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const retryExchange = RabbitMQExchangeNameFormatter_1.RabbitMQExchangeNameFormatter.retry(params.exchange);
            const deadLetterExchange = RabbitMQExchangeNameFormatter_1.RabbitMQExchangeNameFormatter.deadLetter(params.exchange);
            yield this.connection.exchange({ name: params.exchange });
            yield this.connection.exchange({ name: retryExchange });
            yield this.connection.exchange({ name: deadLetterExchange });
            for (const subscriber of params.subscribers) {
                yield this.addQueue(subscriber, params.exchange);
            }
        });
    }
    addQueue(subscriber, exchange) {
        return __awaiter(this, void 0, void 0, function* () {
            const retryExchange = RabbitMQExchangeNameFormatter_1.RabbitMQExchangeNameFormatter.retry(exchange);
            const deadLetterExchange = RabbitMQExchangeNameFormatter_1.RabbitMQExchangeNameFormatter.deadLetter(exchange);
            const routingKeys = this.getRoutingKeysFor(subscriber);
            const queue = this.queueNameFormatter.format(subscriber);
            const deadLetterQueue = this.queueNameFormatter.formatDeadLetter(subscriber);
            const retryQueue = this.queueNameFormatter.formatRetry(subscriber);
            yield this.connection.queue({ routingKeys, name: queue, exchange });
            yield this.connection.queue({
                routingKeys: [queue],
                name: retryQueue,
                exchange: retryExchange,
                messageTtl: this.messageRetryTtl,
                deadLetterExchange: exchange,
                deadLetterQueue: queue
            });
            yield this.connection.queue({ routingKeys: [queue], name: deadLetterQueue, exchange: deadLetterExchange });
        });
    }
    getRoutingKeysFor(subscriber) {
        const routingKeys = subscriber.subscribedTo().map(event => event.EVENT_NAME);
        const queue = this.queueNameFormatter.format(subscriber);
        routingKeys.push(queue);
        return routingKeys;
    }
}
exports.RabbitMQConfigurer = RabbitMQConfigurer;
