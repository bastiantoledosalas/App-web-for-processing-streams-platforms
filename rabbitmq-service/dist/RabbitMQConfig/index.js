"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RabbitMQConfigFactory_1 = require("RabbitMQConfigFactory"); // Definir la fábrica de configuración
class RabbitMQConfigService {
    constructor() {
        this.config = RabbitMQConfigFactory_1.RabbitMQConfigFactory.createConfig(); // Cargar configuración
    }
    getConfig() {
        return this.config;
    }
    printConfig() {
        console.log(this.config);
    }
}
const rabbitMQConfigService = new RabbitMQConfigService();
rabbitMQConfigService.printConfig(); // Mostrar la configuración cargada
