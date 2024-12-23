
"use client"
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import ReactFlow, {
  ReactFlowInstance,
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
} from 'react-flow-renderer';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewSimulation = () => {
  const router = useRouter();
  const { id } = router.query;

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch simulation data dynamically
  const fetchSimulationData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.get(`http://localhost:3000/api/simulations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const { nodes: fetchedNodes, edges: fetchedEdges } = response.data;

      setNodes(
        fetchedNodes.map((node: any) => ({
          id: node.id,
          data: { label: node.label },
          position: node.position,
        }))
      );

      setEdges(
        fetchedEdges.map((edge: any) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          animated: edge.animated || false,
        }))
      );

      setLoading(false);
    } catch (error) {
      console.error('Error fetching simulation details:', error);
      toast.error('Error al cargar los detalles de la simulación');
      setLoading(false);
    }
  }, [id]);

  // Reload data when component mounts or ID changes
  useEffect(() => {
    fetchSimulationData();
  }, [fetchSimulationData]);

  // Handle user interactions for updating the graph (optional)
  const onNodesChange = (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds));

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {loading ? (
        <p>Cargando simulación...</p>
      ) : (
        <>
          <h1 style={{ textAlign: 'center' }}>Vista de Simulación</h1>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onInit={setReactFlowInstance}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </>
      )}
    </div>
  );
};

export default ViewSimulation;