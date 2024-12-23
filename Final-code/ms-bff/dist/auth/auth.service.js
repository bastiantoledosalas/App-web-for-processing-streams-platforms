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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(jwtService, httpService) {
        this.jwtService = jwtService;
        this.httpService = httpService;
        this.baseUrl = 'http://localhost:3001/ms-users';
    }
    async register(signupDto) {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(`${this.baseUrl}/users`, {
                ...signupDto,
                role: 'user',
            }));
            const user = response.data;
            return this.login(user);
        }
        catch (error) {
            console.log({ error });
            throw new common_1.BadRequestException('Error creating user');
        }
    }
    async findUserById(id) {
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${this.baseUrl}/users/${id}`));
            return response.data;
        }
        catch (error) {
            console.log({ error });
        }
    }
    async login(signinDto) {
        const { email, password } = signinDto;
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${this.baseUrl}/users/by-email/${email}`));
            const userFound = response.data;
            if (!userFound) {
                throw new common_1.BadRequestException('User not found');
            }
            if (!bcrypt.compareSync(password, userFound.password)) {
                throw new common_1.BadRequestException('Invalid password');
            }
            const payload = {
                name: userFound.name,
                email: userFound.email,
                role: userFound.role,
            };
            return { ...payload, token: this.getJwtToken({ id: userFound._id }) };
        }
        catch (error) {
            console.log({ error });
        }
    }
    getJwtToken(payload) {
        const token = this.jwtService.sign(payload);
        return token;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        axios_1.HttpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map