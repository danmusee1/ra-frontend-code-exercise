import { createRoute, createRouter, redirect } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { AddEditPeoplePage } from '../pages/add-edit-people';
import { PeoplePage } from '../pages/people/page';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: PeoplePage,
});

export const newPersonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/people/new',
  component: AddEditPeoplePage,
});

export const editPersonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/people/edit/$id',
  component: AddEditPeoplePage,
});

const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  beforeLoad: () => {
    throw redirect({
      to: '/',
    });
  },
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  newPersonRoute,
  editPersonRoute,
  catchAllRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
