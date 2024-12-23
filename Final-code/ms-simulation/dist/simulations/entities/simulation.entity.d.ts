import { Document } from 'mongoose';
declare class Data {
    name: string;
    type: string;
    replicationLevel: number;
    groupType: string;
    processor: string;
    avgServiceTimeType?: string;
    avgServiceTimeValue?: string;
    arrivalRateType?: string;
    arrivalRateValue?: string;
    numberOutputTweetsType?: string;
    numberOutputTweetsValue?: string;
}
declare class Position {
    x: number;
    y: number;
}
declare class Measured {
    width: number;
    height: number;
}
declare class Node {
    id: string;
    type: string;
    data: Data;
    position: Position;
    measured: Measured;
    selected?: boolean;
    dragging?: boolean;
}
declare class EdgeData {
    duration: number;
    shape: string;
    path: string;
}
declare class Edge {
    source: string;
    target: string;
    type: string;
    data: EdgeData;
    id: string;
}
export declare class Simulation extends Document {
    name: string;
    description: string;
    nodes: Node[];
    edges: Edge[];
    status: string;
    user: string;
}
export declare const SimulationSchema: import("mongoose").Schema<Simulation, import("mongoose").Model<Simulation, any, any, any, Document<unknown, any, Simulation> & Simulation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Simulation, Document<unknown, {}, import("mongoose").FlatRecord<Simulation>> & import("mongoose").FlatRecord<Simulation> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export {};
