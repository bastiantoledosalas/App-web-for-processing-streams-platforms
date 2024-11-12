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
exports.ConfigureRabbitMQCommand = void 0;
const DomainEventSubscribers_1 = require("../../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers");
const RabbitMQConfigurer_1 = require("../RabbitMQ/RabbitMQConfigurer");
class ConfigureRabbitMQCommand {
    static run() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = container.get('Backoffice.Shared.RabbitMQConnection');
            const nameFormatter = container.get('Backoffice.Shared.RabbitMQQueueFormatter');
            const { exchangeSettings, retryTtl } = container.get('Backoffice.Shared.RabbitMQConfig');
            yield connection.connect();
            const configurer = new RabbitMQConfigurer_1.RabbitMQConfigurer(connection, nameFormatter, retryTtl);
            const subscribers = DomainEventSubscribers_1.DomainEventSubscribers.from(container).items;
            yield configurer.configure({ exchange: exchangeSettings.name, subscribers });
            yield connection.close();
        });
    }
}
exports.ConfigureRabbitMQCommand = ConfigureRabbitMQCommand;
