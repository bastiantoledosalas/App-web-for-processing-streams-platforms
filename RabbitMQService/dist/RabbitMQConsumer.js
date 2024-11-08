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
exports.RabbitMQConsumer = void 0;
class RabbitMQConsumer {
    constructor(params) {
        this.subscriber = params.subscriber;
        this.deserializer = params.deserializer;
        this.connection = params.connection;
        this.maxRetries = params.maxRetries;
        this.queueName = params.queueName;
        this.exchange = params.exchange;
    }
    onMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = message.content.toString();
            const domainEvent = this.deserializer.deserialize(content);
            try {
                yield this.subscriber.on(domainEvent);
            }
            catch (error) {
                yield this.handleError(message);
            }
            finally {
                this.connection.ack(message);
            }
        });
    }
    handleError(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasBeenRedeliveredTooMuch(message)) {
                yield this.deadLetter(message);
            }
            else {
                yield this.retry(message);
            }
        });
    }
    retry(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.retry(message, this.queueName, this.exchange);
        });
    }
    deadLetter(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.deadLetter(message, this.queueName, this.exchange);
        });
    }
    hasBeenRedeliveredTooMuch(message) {
        if (this.hasBeenRedelivered(message)) {
            const count = parseInt(message.properties.headers['redelivery_count']);
            return count >= this.maxRetries;
        }
        return false;
    }
    hasBeenRedelivered(message) {
        return message.properties.headers['redelivery_count'] !== undefined;
    }
}
exports.RabbitMQConsumer = RabbitMQConsumer;
