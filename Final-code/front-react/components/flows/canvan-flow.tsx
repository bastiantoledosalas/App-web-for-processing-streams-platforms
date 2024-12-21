'use client';
import React from 'react';
import { ReactFlow, Controls, MiniMap, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NodeTemplate } from './node-template';
import { AnimatedSvgEdge } from '../animated-svg-edge';

const defaultViewport = { x: 0, y: 0, zoom: 0.7 };
const nodeTypes = {
  custom: NodeTemplate,
};

const edgeTypes = {
  animatedSvgEdge: AnimatedSvgEdge,
};

export const CanvanFlow = ({
  dataNodes,
  dataEdges,
  onConnect,
  onNodesChange,
  onEdgesChange,
}: any) => {


  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={dataNodes}
        edges={dataEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        defaultViewport={defaultViewport}
        attributionPosition="bottom-left"
        style={{ background: '#f4f5fd' }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        <Controls />
        <MiniMap zoomable pannable />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};