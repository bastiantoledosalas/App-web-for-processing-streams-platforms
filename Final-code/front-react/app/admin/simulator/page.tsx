'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { CanvanFlow } from '@/components/flows/canvan-flow';
import { NodeForm } from '@/components/flows/node-form';
import { Button } from '@/components/ui/button';
import {
  addEdge,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import ModalFlow from '@/components/flows/modal-flow';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

type SimulationData = {
  name: string;
  description: string;
  id?: string;
};

const initialSimulationData: SimulationData = {
  name: '',
  description: '',
  id: '',
};

const Simulator = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';

  const [result, setResult] = useState<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState('create');
  const [initialData, setInitialData] = useState<SimulationData>(initialSimulationData);
  const [isViewing, setIsViewing] = useState(false);  // Estado para controlar la vista

  useEffect(() => {
    if (id) {
      getDataFromApi({ id });
      setAction('update');
      setIsViewing(false);
    } else {
      setAction('create');
      handleReset();
      setInitialData(initialSimulationData);
      setIsViewing(false);
    }
  }, [id]);

  const getDataFromApi = async ({ id }: { id: string }) => {
    const token = localStorage.getItem('token');

    console.log('TOKEN:',token);

    const response = await fetch(`http://localhost:3000/api/simulations/${id}`, {
      method: 'GET', 
        headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
      toast.error('Error al obtener los datos');
      return;
    }

    const data = await response.json();

    // Aquí asigna 'selected' y 'dragging' si no se ha movido
    const updatedNodes = data.nodes.map((node: any) => ({
      ...node,
      position: node.position || { x: 0, y: 25 },               // posición predeterminada si no existe
      selected: node.position ? node.selected || false : false, // Si el nodo no se movió, asignamos `selected` como `false`
      dragging: false,                                          // Si no se está moviendo, asignamos `dragging` como `false`
    }));

    setNodes(updatedNodes);
    setEdges(data.edges);
    setInitialData({ name: data.name, description: data.description, id });
  };

  const onConnect = useCallback(
    (params: never[]) =>
      setEdges(
        (eds: any) =>
          addEdge(
            {
              ...params,
              type: 'animatedSvgEdge',
              data: {
                duration: 3,
                shape: 'package',
                path: 'smoothstep',
              },
            } as any,
            eds,
          ) as any,
      ),
    [],
  );

  const onNodesDelete = useCallback(
    (deleted: any) => {
      setEdges(
        deleted.reduce((acc: any, node: any) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge: any) => !connectedEdges.includes(edge as never),
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(
              ({ id: target }) =>
                ({
                  id: `${source}->${target}`,
                  source,
                  target,
                } as any),
            ),
          );

          return [...remainingEdges, ...createdEdges];
        }, edges),
      );
    },
    [nodes, edges],
  );

  const onSubmitData = (data: any) => {
    const newNode = {
      id: `${data.type}-${nodes.length}`,
      type: 'custom',
      data,
      position: { x: 0, y: 25 },
      selected: false,  // Nodo no seleccionado inicialmente
      dragging: false,  // Nodo no en movimiento inicialmente
    };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes as any);
  };

  const handleReset = () => {
    setNodes([]);
    setEdges([]);
    setResult(null);
    router.push('/admin/simulator');
  };

  const handleSave = () => {
    setResult({ nodes, edges });
    setShowModal(true);
  };

  return (
    <div>
      <div>
        <NodeForm onSubmitData={onSubmitData} />
      </div>

      <div className="border rounded-md mt-4 ">
        <div>
          <CanvanFlow
            dataNodes={nodes}
            dataEdges={edges}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodesDelete={onNodesDelete}
          />
          <div className="flex justify-end space-x-2 py-2 pr-2 border-t">
            <Button variant="outline" onClick={handleReset}>
              Reestablecer
            </Button>
            <Button onClick={handleSave}>Guardar</Button>
          </div>
        </div>
      </div>
      <ModalFlow
        simulation={result}
        open={showModal}
        setOpen={setShowModal}
        initialData={initialData}
        onSaved={handleReset}
        action={action}
      />
    </div>
  );
};

export default Simulator;
