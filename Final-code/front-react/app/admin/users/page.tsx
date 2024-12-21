'use client';
import React from 'react';

import { ListUsers } from './list';
import { HeaderPage } from '@/components/navigation/header-page';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const SimulationsPage = () => {
  const router = useRouter();

  return (
    <div>
      <HeaderPage
        title="Gestión de Usuarios"
        description="Listado de usuarios"
        actions={
          <Button onClick={() => router.push('/admin/users')}>
            Crear nuevo usuario
          </Button>
        }
      />
      <ListUsers />
    </div>
  );
};

export default SimulationsPage;
