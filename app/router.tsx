import { QueryClient } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';

import { DefaultCatchBoundary } from '~/lib/components/DefaultCatchBoundary';
import { NotFound } from '~/lib/components/NotFound';
import { routeTree } from './routeTree.gen';
import { ConvexQueryClient } from '@convex-dev/react-query';
import { ConvexProvider } from 'convex/react';
import { SurrealProvider } from '../lib/surrealProvider';

export function createRouter() {
  const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL!;
  if (!CONVEX_URL) {
    console.error('missing envar VITE_CONVEX_URL');
  }
  const convexQueryClient = new ConvexQueryClient(CONVEX_URL);

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  });
  convexQueryClient.connect(queryClient);

  const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      defaultPreload: 'intent',
      context: { queryClient },
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: NotFound,
      scrollRestoration: true,
      Wrap: ({ children }) => (
        <ConvexProvider client={convexQueryClient.convexClient}>
          <SurrealProvider endpoint="wss://united-viper-06au59aabpp7d03fme5r7n5an0.aws-use1.surreal.cloud"
          	params={{ namespace: "mvp", database: "mvp-dev" }}>
          {children}
          </SurrealProvider>
        </ConvexProvider>
      ),
    }),
    queryClient,
  );

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
