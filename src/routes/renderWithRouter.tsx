import { ReactElement } from 'react';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';

/**
 * Renders `component` inside a minimal real router so that `<Link>`,
 * `useNavigate()`, `useSearch()` etc. work exactly as they would in the
 * app, without pulling in the full app route tree. Memory history keeps
 * each test isolated (no shared URL state across tests/files).
 */
export const createTestRouter = (
  component: () => ReactElement,
  {
    initialEntries = ['/'],
    validateSearch,
  }: {
    initialEntries?: string[];
    validateSearch?: (search: Record<string, unknown>) => unknown;
  } = {}
) => {
  const rootRoute = createRootRoute();

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component,
    ...(validateSearch ? { validateSearch } : {}),
  });

  const newPersonRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/people/new',
    component: () => null,
  });

  const editPersonRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/people/edit/$id',
    component: () => null,
  });

  const routeTree = rootRoute.addChildren([
    indexRoute,
    newPersonRoute,
    editPersonRoute,
  ]);

  const history = createMemoryHistory({ initialEntries });
  const router = createRouter({ routeTree, history });

  return router;
};

export const TestRouterRoot = ({ router }: { router: ReturnType<typeof createTestRouter> }) => (
  <RouterProvider router={router} />
);