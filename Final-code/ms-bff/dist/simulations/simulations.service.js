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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let SimulationsService = class SimulationsService {
    constructor(httpService) {
        this.httpService = httpService;
        this.baseUrl = 'http://localhost:5000/ms-simulations';
        this.simulateStartUrl = `http://localhost:3002/ms-simulations`;
    }
    async create(createSimulationDto, userId) {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(`${this.baseUrl}/simulations`, {
                ...createSimulationDto,
                user: userId,
            }));
            return response.data;
        }
        catch (error) {
            console.log({ error: error.response.data });
            throw new common_1.BadRequestException('Error creating simulation');
        }
    }
    async findAll(user_id) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${this.baseUrl}/simulations?user_id=${user_id}`));
        return response.data;
    }
    async findOne(id) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${this.baseUrl}/simulations/${id}`));
        return response.data;
    }
    async update(id, updateSimulationDto) {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.put(`${this.baseUrl}/simulations/${id}`, updateSimulationDto));
            return response.data;
        }
        catch (error) {
            console.log({ error: error.response.data });
            throw new common_1.BadRequestException('Error updating simulation');
        }
    }
    async remove(id) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.delete(`${this.baseUrl}/simulations/${id}`));
        return response.data;
    }
    async start(id, startSimulationDto) {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(`${this.baseUrl}/simulations/${id}`, startSimulationDto));
            return response.data;
        }
        catch (error) {
            throw new common_1.BadRequestException('Error creating simulation');
        }
    }
};
exports.SimulationsService = SimulationsService;
exports.SimulationsService = SimulationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], SimulationsService);
//# sourceMappingURL=simulations.service.js.map