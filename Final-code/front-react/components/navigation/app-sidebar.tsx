'use client';
import { ChevronUp, ListTree, Settings, Users, Workflow } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import Image from 'next/image';

import { useSession } from 'next-auth/react';

const items = [
  {
    title: 'Simulador',       // Título del enlace
    url: '/admin/simulator',  // URL de navegación
    icon: Workflow,           // Ícono que se muestra
    roles: ['admin', 'user']
  },
  {
    title: 'Simulaciones',
    url: '/admin/simulations',
    icon: ListTree,
    roles:['admin','user']
  },
  {
    title: 'Usuarios',
    url: '/admin/users',
    icon: Users,
    roles:['admin']
  },
];

export const AppSidebar = () => {
  const { data: session } = useSession();
  if (!session) return null;

  const role = session.user?.role;
  const filteredItems = items.filter((item) => item.roles.includes(role)); // Filtra correctamente

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex justify-center">
          <Image
            src="/wss-white.png"
            width={180}
            height={32}
            alt="logo"
            className="pr-2"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sistema de simulaciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className='mr-2'/>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
