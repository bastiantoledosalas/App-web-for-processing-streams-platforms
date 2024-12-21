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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,         // Contiene los elementos del menú
  DropdownMenuTrigger,      // Botón para abrir el menú
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import Image from 'next/image';

import { useSession, signOut } from 'next-auth/react';

const items = [
  {
    title: 'Simulador',       // Título del enlace
    url: '/admin/simulator',  // URL de navegación
    icon: Workflow,           // Ícono que se muestra
  },
  {
    title: 'Simulaciones',
    url: '/admin/simulations',
    icon: ListTree,
  },
  {
    title: 'Usuarios',
    url: '/admin/users',
    icon: Users,
  },

  {
    title: 'Configuraciones',
    url: '/admin/settings',
    icon: Settings,
  },
];

export const AppSidebar = () => {
  const { data: session } = useSession();
  if (!session) return null;
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {session.user?.name && (
                    <Image
                      src={`https://ui-avatars.com/api/?name=${session.user?.name}`}
                      width={24}
                      height={24}
                      className="rounded-full"
                      alt="avatar"
                    />
                  )}
                  {session.user?.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Simulaciones</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    signOut();
                  }}
                >
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
