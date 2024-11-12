"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigureRabbitMQCommand_1 = require("../ConfigureRabbitMQCommand");
ConfigureRabbitMQCommand_1.ConfigureRabbitMQCommand.run()
    .then(() => {
    console.log('RabbitMQ Configuration success');
    process.exit(0);
})
    .catch(error => {
    console.log('RabbitMQ Configuration fail', error);
    process.exit(1);
});
