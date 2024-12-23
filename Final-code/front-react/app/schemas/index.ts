import * as z from 'zod';

const NODE_TYPES = ['S', 'B'];
const GROUP_TYPES = ['0', '1', '2', '3'];

export const cleanNodeData = (node: any) =>{
  const cleanedNode= {...node};

  // Eliminar campos innecesarios para nodos tipo 'S'
  if (node.type === 'S'){
    delete cleanedNode.numberOutputTweetsType;
    delete cleanedNode.numberOutputTweetsValue;
  }

  if (node.type === 'B'){
    delete cleanedNode.arrivalRateType;
    delete cleanedNode.arrivalRateValue;
  }
  return cleanedNode;
}

// Esquema principal para validar nodos
export const NodeSchema = z
  .object({
    name: z.string().min(3).max(50),
    type: z.string().refine((data) => NODE_TYPES.includes(data)),
    replicationLevel: z.number().int().min(1).max(100),
    groupType: z.string().refine((data) => GROUP_TYPES.includes(data)),
    processor: z.string().refine((data) => {
      const ip = data.split('.');
      const [octet1, octet2, octet3, octet4] = ip.map((num) => parseInt(num));

      // Validar el rango de la IP: 10.0.0.0 - 10.3.1.254
      return (
        ip.length === 4 &&
        ip.every((num) => parseInt(num) >= 0 && parseInt(num) <= 255) &&
        octet1 === 10 &&
        octet2 >= 0 && octet2 <= 3 &&
        octet3 >= 0 && octet3 <= 1 &&
        octet4 >= 0 && octet4 <= 254
      );
    },{
      message: "IP no válida. Debe estar en el rango 10.0.0.0 - 10.3.1.254"
    }),
    avgServiceTimeType: z.string().min(2),
    avgServiceTimeValue: z.string().min(2),

    // Campos específicos para tipo 'S'
    arrivalRateType: z.string().optional(),
    arrivalRateValue: z.string().optional(),

    // Campos específicos para tipo 'B'
    numberOutputTweetsType: z.string().optional(),
    numberOutputTweetsValue: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Condicionalmente hacer obligatorio arrivalRateType si type es 'S'
    if (data.type === 'S' && !data.arrivalRateType) {
      ctx.addIssue({
        path: ['arrivalRateType'],
        message: 'Campo obligatorio',
      } as any);
      ctx.addIssue({
        path: ['arrivalRateValue'],
        message: 'Campo obligatorio',
      } as any);
    }

    // Validar campos obligatorios para nodos tipo 'B'
    if (data.type === 'B' && !data.numberOutputTweetsType) {
      ctx.addIssue({
        path: ['numberOutputTweetsType'],
        message: 'Campo obligatorio',
      } as any);
      ctx.addIssue({
        path: ['numberOutputTweetsValue'],
        message: 'Campo obligatorio',
      } as any);
    }
  });

// Esquema para crear simulaciones
export const SimulationCreateSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(3).max(50),
});

// Validar nodo antes de guardar
export const validateNode = (node: any) => {
  const cleanedNode = cleanNodeData(node);  // Limpiar campos innecesarios
  return NodeSchema.parse(cleanedNode);     // Validar datos limpios
};

  // Validar conjunto de nodos
export const validateSimulationData = (nodes: any[]) => {
  return nodes.every((node) => {
    if (node.type === 'S') {
      return !node.numberOutputTweetsType && !node.numberOutputTweetsValue;
    }
    if (node.type === 'B') {
      return !node.arrivalRateType && !node.arrivalRateValue;
    }
    return true;
  });
};

