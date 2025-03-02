import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Button } from '@/components/ui/button';

import Header from '../components/Header';

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Button> hola</Button>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
