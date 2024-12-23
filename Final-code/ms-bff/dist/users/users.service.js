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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let UsersService = class UsersService {
    constructor(httpService) {
        this.httpService = httpService;
        this.baseUrl = 'http://localhost:3001/ms-users';
    }
    async create(createUserDto) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(`${this.baseUrl}/users`, createUserDto));
        return response.data;
    }
    async findAll() {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${this.baseUrl}/users`));
        return response.data;
    }
    async findOne(id) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${this.baseUrl}/users/${id}`));
        return response.data;
    }
    async update(id, updateUserDto) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.patch(`${this.baseUrl}/users/${id}`, updateUserDto));
        return response.data;
    }
    async updatePassword(id, updatePasswordDto) {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.put(`${this.baseUrl}/users/${id}/password`, updatePasswordDto));
            return response.data;
        }
        catch (error) {
            console.log({ error });
            if (error.response.status === 404) {
                throw new common_1.NotFoundException('User not found');
            }
            throw new common_1.BadRequestException('Error updating password');
        }
    }
    async remove(id) {
        try {
            await (0, rxjs_1.lastValueFrom)(this.httpService.delete(`${this.baseUrl}/users/${id}`));
        }
        catch (error) {
            if (error.response.status === 404) {
                throw new common_1.NotFoundException('User not found');
            }
            throw new common_1.BadRequestException('Error deleting user');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], UsersService);
//# sourceMappingURL=users.service.js.map