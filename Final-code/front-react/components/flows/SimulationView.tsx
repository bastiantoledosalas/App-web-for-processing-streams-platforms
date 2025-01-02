import React from 'react';
import { useRouter } from 'next/router';
import ReactFlow, { Node, Edge } from 'react-flow-renderer';

const ViewSimulation = () => {
  const router = useRouter();
  const { id } = router.query;

  // Simular datos de nodos y aristas, puedes reemplazar esto con una llamada a tu API
  const nodes: Node[] = [
    { id: '1', data: { label: 'Nodo 1' }, position: { x: 100, y: 100 } },
    { id: '2', data: { label: 'Nodo 2' }, position: { x: 300, y: 100 } },
  ];

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
  ];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h1>Vista de Simulación</h1>
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </div>
  );
};

export default ViewSimulation;

