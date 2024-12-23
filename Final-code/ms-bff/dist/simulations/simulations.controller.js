"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationsController = void 0;
const common_1 = require("@nestjs/common");
const simulations_service_1 = require("./simulations.service");
const create_simulation_dto_1 = require("./dto/create-simulation.dto");
const update_simulation_dto_1 = require("./dto/update-simulation.dto");
const start_simulation_dto_1 = require("./dto/start-simulation.dto");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
let SimulationsController = class SimulationsController {
    constructor(simulationsService) {
        this.simulationsService = simulationsService;
    }
    create(createSimulationDto, user) {
        return this.simulationsService.create(createSimulationDto, user._id);
    }
    findAll(user) {
        return this.simulationsService.findAll(user._id);
    }
    findOne(id) {
        return this.simulationsService.findOne(id);
    }
    update(id, updateSimulationDto) {
        return this.simulationsService.update(id, updateSimulationDto);
    }
    remove(id) {
        return this.simulationsService.remove(id);
    }
    start(id, startSimulationDto) {
        return this.simulationsService.start(id, startSimulationDto);
    }
};
exports.SimulationsController = SimulationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_simulation_dto_1.CreateSimulationDto, Object]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_simulation_dto_1.UpdateSimulationDto]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, start_simulation_dto_1.StartSimulationDto]),
    __metadata("design:returntype", void 0)
], SimulationsController.prototype, "start", null);
exports.SimulationsController = SimulationsController = __decorate([
    (0, common_1.Controller)('simulations'),
    (0, auth_decorator_1.Auth)(),
    __metadata("design:paramtypes", [simulations_service_1.SimulationsService])
], SimulationsController);
//# sourceMappingURL=simulations.controller.js.map