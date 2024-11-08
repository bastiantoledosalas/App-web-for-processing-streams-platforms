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
exports.RabbitMqConnection = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const RabbitMQExchangeNameFormatter_1 = require("./RabbitMQExchangeNameFormatter");
class RabbitMqConnection {
    constructor(params) {
        this.connectionSettings = params.connectionSettings;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = yield this.amqpConnect();
            this.channel = yield this.amqpChannel();
        });
    }
    exchange(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = this.channel) === null || _a === void 0 ? void 0 : _a.assertExchange(params.name, 'topic', { durable: true }));
        });
    }
    queue(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const durable = true;
            const exclusive = false;
            const autoDelete = false;
            const args = this.getQueueArguments(params);
            yield ((_a = this.channel) === null || _a === void 0 ? void 0 : _a.assertQueue(params.name, {
                exclusive,
                durable,
                autoDelete,
                arguments: args
            }));
            for (const routingKey of params.routingKeys) {
                yield this.channel.bindQueue(params.name, params.exchange, routingKey);
            }
        });
    }
    getQueueArguments(params) {
        let args = {};
        if (params.deadLetterExchange) {
            args = Object.assign(Object.assign({}, args), { 'x-dead-letter-exchange': params.deadLetterExchange });
        }
        if (params.deadLetterQueue) {
            args = Object.assign(Object.assign({}, args), { 'x-dead-letter-routing-key': params.deadLetterQueue });
        }
        if (params.messageTtl) {
            args = Object.assign(Object.assign({}, args), { 'x-message-ttl': params.messageTtl });
        }
        return args;
    }
    deleteQueue(queue) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.channel.deleteQueue(queue);
        });
    }
    amqpConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            const { hostname, port, secure } = this.connectionSettings.connection;
            const { username, password, vhost } = this.connectionSettings;
            const protocol = secure ? 'amqps' : 'amqp';
            const connection = yield amqplib_1.default.connect({
                protocol,
                hostname,
                port,
                username,
                password,
                vhost
            });
            connection.on('error', (err) => {
                Promise.reject(err);
            });
            return connection;
        });
    }
    amqpChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield this.connection.createConfirmChannel();
            yield channel.prefetch(1);
            return channel;
        });
    }
    publish(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { routingKey, content, options, exchange } = params;
            return new Promise((resolve, reject) => {
                this.channel.publish(exchange, routingKey, content, options, (error) => error ? reject(error) : resolve());
            });
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield ((_a = this.channel) === null || _a === void 0 ? void 0 : _a.close());
            return yield ((_b = this.connection) === null || _b === void 0 ? void 0 : _b.close());
        });
    }
    consume(queue, onMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.channel.consume(queue, (message) => {
                if (!message) {
                    return;
                }
                onMessage(message);
            });
        });
    }
    ack(message) {
        this.channel.ack(message);
    }
    retry(message, queue, exchange) {
        return __awaiter(this, void 0, void 0, function* () {
            const retryExchange = RabbitMQExchangeNameFormatter_1.RabbitMQExchangeNameFormatter.retry(exchange);
            const options = this.getMessageOptions(message);
            return yield this.publish({ exchange: retryExchange, routingKey: queue, content: message.content, options });
        });
    }
    deadLetter(message, queue, exchange) {
        return __awaiter(this, void 0, void 0, function* () {
            const deadLetterExchange = RabbitMQExchangeNameFormatter_1.RabbitMQExchangeNameFormatter.deadLetter(exchange);
            const options = this.getMessageOptions(message);
            return yield this.publish({ exchange: deadLetterExchange, routingKey: queue, content: message.content, options });
        });
    }
    getMessageOptions(message) {
        const { messageId, contentType, contentEncoding, priority } = message.properties;
        const options = {
            messageId,
            headers: this.incrementRedeliveryCount(message),
            contentType,
            contentEncoding,
            priority
        };
        return options;
    }
    incrementRedeliveryCount(message) {
        if (this.hasBeenRedelivered(message)) {
            const count = parseInt(message.properties.headers['redelivery_count']);
            message.properties.headers['redelivery_count'] = count + 1;
        }
        else {
            message.properties.headers['redelivery_count'] = 1;
        }
        return message.properties.headers;
    }
    hasBeenRedelivered(message) {
        return message.properties.headers['redelivery_count'] !== undefined;
    }
}
exports.RabbitMqConnection = RabbitMqConnection;
