'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';

import { cn } from '@/lib/utils';

import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import { UserNavigation } from './auth/user-navigation';
import { SidebarTrigger } from '../ui/sidebar';

export const TopNavigation = () => {
  const { data: session } = useSession();

  if (!session) return null;
  return (
    <div className="border-b sticky top-0 bg-white z-10">
      <div className="flex items-center justify-between h-14 ">
        <SidebarTrigger className="ml-4" />
        <UserNavigation />
      </div>
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
