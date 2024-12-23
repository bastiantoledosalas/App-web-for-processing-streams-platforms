"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationsModule = void 0;
const common_1 = require("@nestjs/common");
const simulations_service_1 = require("./simulations.service");
const simulations_controller_1 = require("./simulations.controller");
const mongoose_1 = require("@nestjs/mongoose");
const simulation_entity_1 = require("./entities/simulation.entity");
let SimulationsModule = class SimulationsModule {
};
exports.SimulationsModule = SimulationsModule;
exports.SimulationsModule = SimulationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: simulation_entity_1.Simulation.name, schema: simulation_entity_1.SimulationSchema },
            ]),
        ],
        controllers: [simulations_controller_1.SimulationsController],
        providers: [simulations_service_1.SimulationsService],
    })
], SimulationsModule);
//# sourceMappingURL=simulations.module.js.map