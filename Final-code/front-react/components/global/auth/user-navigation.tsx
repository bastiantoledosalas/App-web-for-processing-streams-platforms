import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

import { useSession, signIn, signOut } from 'next-auth/react';

export const UserNavigation = () => {
  const { data: session } = useSession();
  console.log({ session });
  if (!session) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
        <div className="flex items-center gap-x-2">
          {session.user?.image && (
            <Image
              src={session.user.image}
              width={24}
              height={24}
              className="rounded-full"
              alt="avatar"
            />
          )}
          {session.user?.name}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Perfil</DropdownMenuItem>
        <DropdownMenuItem>Mis simulaciones</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
          }}
        >
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
