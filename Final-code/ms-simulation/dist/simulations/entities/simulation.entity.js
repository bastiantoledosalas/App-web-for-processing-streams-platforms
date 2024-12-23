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
exports.SimulationSchema = exports.Simulation = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Data = class Data {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Data.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Data.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Data.prototype, "replicationLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Data.prototype, "groupType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Data.prototype, "processor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Data.prototype, "avgServiceTimeType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Data.prototype, "avgServiceTimeValue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Data.prototype, "arrivalRateType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Data.prototype, "arrivalRateValue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Data.prototype, "numberOutputTweetsType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Data.prototype, "numberOutputTweetsValue", void 0);
Data = __decorate([
    (0, mongoose_1.Schema)()
], Data);
const DataSchema = mongoose_1.SchemaFactory.createForClass(Data);
let Position = class Position {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Position.prototype, "x", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Position.prototype, "y", void 0);
Position = __decorate([
    (0, mongoose_1.Schema)()
], Position);
const PositionSchema = mongoose_1.SchemaFactory.createForClass(Position);
let Measured = class Measured {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Measured.prototype, "width", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Measured.prototype, "height", void 0);
Measured = __decorate([
    (0, mongoose_1.Schema)()
], Measured);
const MeasuredSchema = mongoose_1.SchemaFactory.createForClass(Measured);
let Node = class Node {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Node.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Node.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: DataSchema, required: true }),
    __metadata("design:type", Data)
], Node.prototype, "data", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PositionSchema, required: true }),
    __metadata("design:type", Position)
], Node.prototype, "position", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: MeasuredSchema, required: true }),
    __metadata("design:type", Measured)
], Node.prototype, "measured", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Boolean)
], Node.prototype, "selected", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Boolean)
], Node.prototype, "dragging", void 0);
Node = __decorate([
    (0, mongoose_1.Schema)()
], Node);
const NodeSchema = mongoose_1.SchemaFactory.createForClass(Node);
let EdgeData = class EdgeData {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], EdgeData.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EdgeData.prototype, "shape", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EdgeData.prototype, "path", void 0);
EdgeData = __decorate([
    (0, mongoose_1.Schema)()
], EdgeData);
const EdgeDataSchema = mongoose_1.SchemaFactory.createForClass(EdgeData);
let Edge = class Edge {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Edge.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Edge.prototype, "target", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Edge.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: EdgeDataSchema, required: true }),
    __metadata("design:type", EdgeData)
], Edge.prototype, "data", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Edge.prototype, "id", void 0);
Edge = __decorate([
    (0, mongoose_1.Schema)()
], Edge);
const EdgeSchema = mongoose_1.SchemaFactory.createForClass(Edge);
let Simulation = class Simulation extends mongoose_2.Document {
};
exports.Simulation = Simulation;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Simulation.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Simulation.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [NodeSchema], required: true }),
    __metadata("design:type", Array)
], Simulation.prototype, "nodes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [EdgeSchema], required: true }),
    __metadata("design:type", Array)
], Simulation.prototype, "edges", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Simulation.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Simulation.prototype, "user", void 0);
exports.Simulation = Simulation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Simulation);
exports.SimulationSchema = mongoose_1.SchemaFactory.createForClass(Simulation);
//# sourceMappingURL=simulation.entity.js.map