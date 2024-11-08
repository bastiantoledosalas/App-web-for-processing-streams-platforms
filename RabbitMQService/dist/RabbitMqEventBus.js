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
exports.RabbitMQEventBus = void 0;
const DomainEventDeserializer_1 = require("../DomainEventDeserializer");
const DomainEventJsonSerializer_1 = require("../DomainEventJsonSerializer");
const RabbitMQConsumerFactory_1 = require("./RabbitMQConsumerFactory");
class RabbitMQEventBus {
    constructor(params) {
        const { failoverPublisher, connection, exchange } = params;
        this.failoverPublisher = failoverPublisher;
        this.connection = connection;
        this.exchange = exchange;
        this.queueNameFormatter = params.queueNameFormatter;
        this.maxRetries = params.maxRetries;
    }
    addSubscribers(subscribers) {
        return __awaiter(this, void 0, void 0, function* () {
            const deserializer = DomainEventDeserializer_1.DomainEventDeserializer.configure(subscribers);
            const consumerFactory = new RabbitMQConsumerFactory_1.RabbitMQConsumerFactory(deserializer, this.connection, this.maxRetries);
            for (const subscriber of subscribers.items) {
                const queueName = this.queueNameFormatter.format(subscriber);
                const rabbitMQConsumer = consumerFactory.build(subscriber, this.exchange, queueName);
                yield this.connection.consume(queueName, rabbitMQConsumer.onMessage.bind(rabbitMQConsumer));
            }
        });
    }
    publish(events) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const event of events) {
                try {
                    const routingKey = event.eventName;
                    const content = this.toBuffer(event);
                    const options = this.options(event);
                    yield this.connection.publish({ exchange: this.exchange, routingKey, content, options });
                }
                catch (error) {
                    yield this.failoverPublisher.publish(event);
                }
            }
        });
    }
    options(event) {
        return {
            messageId: event.eventId,
            contentType: 'application/json',
            contentEncoding: 'utf-8'
        };
    }
    toBuffer(event) {
        const eventPrimitives = DomainEventJsonSerializer_1.DomainEventJsonSerializer.serialize(event);
        return Buffer.from(eventPrimitives);
    }
}
exports.RabbitMQEventBus = RabbitMQEventBus;
