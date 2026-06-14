import { ReactElement } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppHeader } from '../app/header';


const RootComponent = (): ReactElement => {
  return (
    <>
      <AppHeader />
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
