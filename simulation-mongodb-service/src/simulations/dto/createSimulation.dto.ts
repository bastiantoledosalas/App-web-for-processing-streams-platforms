import { IsString, IsArray, IsNotEmpty, ValidateNested, IsNumber, IsEnum} from 'class-validator';
import { Type } from 'class-transformer';

class NodeData {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  replicationLevel: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum({ enum: ['0', '1', '2','3']})
  groupType: string;

  @IsNotEmpty()
  @IsString()
  processor: string;

  @IsString()
  avgServiceTimeType: string;

  @IsString()
  avgServiceTimeValue: string;

  @IsString()
  arrivalRate: string;

  @IsString()
  numberOutputTweetsType: string;

  @IsString()
  numberOutputTweetsValue: string;
}

class NodePosition {
  @IsNotEmpty()
  x: number;

  @IsNotEmpty()
  y: number;
}

class Node {
  @IsString()
  id: string;

  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => NodeData)
  data: NodeData;

  @ValidateNested()
  @Type(() => NodePosition)
  position: NodePosition;
}

class EdgeData {
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsString()
  shape: string;

  @IsString()
  path: string;
}

class Edge {
  @IsString()
  source: string;

  @IsString()
  target: string;

  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => EdgeData)
  data: EdgeData;

  @IsString()
  id: string;
}

export class CreateSimulationDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Node)
  nodes: Node[];

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Edge)
  edges: Edge[];
}



