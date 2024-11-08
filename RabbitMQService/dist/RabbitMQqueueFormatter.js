"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQqueueFormatter = void 0;
class RabbitMQqueueFormatter {
    constructor(moduleName) {
        this.moduleName = moduleName;
    }
    format(subscriber) {
        const value = subscriber.constructor.name;
        const name = value
            .split(/(?=[A-Z])/)
            .join('_')
            .toLowerCase();
        return `${this.moduleName}.${name}`;
    }
    formatRetry(subscriber) {
        const name = this.format(subscriber);
        return `retry.${name}`;
    }
    formatDeadLetter(subscriber) {
        const name = this.format(subscriber);
        return `dead_letter.${name}`;
    }
}
exports.RabbitMQqueueFormatter = RabbitMQqueueFormatter;
