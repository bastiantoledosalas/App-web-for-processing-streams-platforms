'use client';
import React from 'react';

import { ListSimulations } from './list';
import { HeaderPage } from '@/components/navigation/header-page';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const SimulationsPage = () => {
  const router = useRouter();

  return (
    <div>
      <HeaderPage
        title="Gestión de Simulaciones"
        description="Listado de simulaciones"
        actions={
          <Button onClick={() => router.push('/admin/simulator')}>
            Crear nueva simulación
          </Button>
        }
      />
      <ListSimulations />
    </div>
  );
};

export default SimulationsPage;
