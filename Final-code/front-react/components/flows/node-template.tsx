import React from 'react';
import { Card} from '../ui/card';
import { Handle, Position } from '@xyflow/react';
import { cleanNodeData } from '@/app/schemas';



const FeatureItemInline = ({ feature }: any) => {
  return (
    <div className="flex justify-between items-center border-b px-2">
      <strong>{feature.label}</strong>
      <span>{feature.value}</span>
    </div>
  );
};

const FeatureItem = ({ feature }: any) => {
  return (
    <div className="flex flex-col border-b px-2">
      <strong>{feature.label}</strong>
      <span className="text-sm">{feature.value}</span>
    </div>
  );
};

interface NodeTemplateProps {
  data: any;
}

export const NodeTemplate = ({ data }: NodeTemplateProps) => {
  // Limpiar los datos antes de usarlos
  const cleanedData = cleanNodeData(data);
  return (
    <Card className="w-80">
      <div
        className={`${
          cleanedData.type === 'B' ? 'bg-bolt' : 'bg-spout'
        } p-3 mb-1 rounded-md mx-2 my-2 font-bold text-center`}
      >
        {cleanedData.name} <small>({cleanedData.type === 'S' ? 'Spout' : 'Bolt'})</small>
      </div>

      <FeatureItemInline
        feature={{ label: 'Replicas', value: cleanedData.replicationLevel }}
      />
      <FeatureItemInline
        feature={{ label: 'Agrupamiento', value: cleanedData.groupType }}
      />
      <FeatureItemInline
        feature={{ label: 'Procesador', value: cleanedData.processor }}
      />
      <FeatureItem
        feature={{
          label: 'Tiempo Promedio Servicio',
          value: cleanedData.avgServiceTimeValue,
        }}
      />
      {data.type === 'S' ? (
        <FeatureItem
          feature={{ label: 'Tasa de Arribo', value: cleanedData.arrivalRateValue }}
        />
      ) : (
        <FeatureItem
          feature={{
            label: 'Número de Tweets de Salida',
            value: cleanedData.numberOutputTweetsValue,
          }}
        />
      )}

      <Handle
        type="target"
        position={Position.Left}
        isConnectable={cleanedData.type === 'B'}
        className={`${
          cleanedData.type === 'B' ? '!bg-slate-400 !w-4 !h-4' : 'hidden'
        }`}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-slate-400 !w-4 !h-4"
      />
    </Card>
  );
};
