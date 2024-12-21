import React from 'react';
import { Card} from '../ui/card';
import { Handle, Position } from '@xyflow/react';

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
  return (
    <Card className="w-80">
      <div
        className={`${
          data.type === 'B' ? 'bg-bolt' : 'bg-spout'
        } p-3 mb-1 rounded-md mx-2 my-2 font-bold text-center`}
      >
        {data.name} <small>({data.type === 'S' ? 'Spout' : 'Bolt'})</small>
      </div>

      <FeatureItemInline
        feature={{ label: 'Replicas', value: data.replicationLevel }}
      />
      <FeatureItemInline
        feature={{ label: 'Agrupamiento', value: data.groupType }}
      />
      <FeatureItemInline
        feature={{ label: 'Procesador', value: data.processor }}
      />
      <FeatureItem
        feature={{
          label: 'Tiempo Promedio Servicio',
          value: data.avgServiceTimeValue,
        }}
      />
      {data.type === 'S' ? (
        <FeatureItem
          feature={{ label: 'Tasa de Arribo', value: data.arrivalRateValue }}
        />
      ) : (
        <FeatureItem
          feature={{
            label: 'Número de Tweets de Salida',
            value: data.numberOutputTweetsValue,
          }}
        />
      )}

      <Handle
        type="target"
        position={Position.Left}
        isConnectable={data.type === 'B'}
        className={`${
          data.type === 'B' ? '!bg-slate-400 !w-4 !h-4' : 'hidden'
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
