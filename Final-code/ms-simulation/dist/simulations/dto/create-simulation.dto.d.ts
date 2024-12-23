declare class DataDto {
    _id?: string;
    name: string;
    type: string;
    replicationLevel: number;
    groupType: string;
    processor: string;
    avgServiceTimeType: string;
    avgServiceTimeValue: string;
    arrivalRateType: string;
    arrivalRateValue: string;
    numberOutputTweetsType: string;
    numberOutputTweetsValue: string;
}
declare class PositionDto {
    _id?: string;
    x: number;
    y: number;
}
declare class MeasuredDto {
    _id?: string;
    width: number;
    height: number;
}
declare class NodeDto {
    _id?: string;
    id: string;
    type: string;
    data: DataDto;
    position: PositionDto;
    measured: MeasuredDto;
    selected?: boolean;
    dragging?: boolean;
}
declare class EdgeDataDto {
    _id?: string;
    duration: number;
    shape: string;
    path: string;
}
declare class EdgeDto {
    _id?: string;
    source: string;
    target: string;
    type: string;
    data: EdgeDataDto;
    id: string;
}
export declare class CreateSimulationDto {
    _id?: string;
    name: string;
    description: string;
    nodes: NodeDto[];
    edges: EdgeDto[];
    user: string;
}
export {};
