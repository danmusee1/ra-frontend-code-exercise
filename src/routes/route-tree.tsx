import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { AppHeader } from '../app/header';
import { AddEditPeoplePage } from '../pages/people/AddEditPeople';
import { PeoplePage } from '../pages/people/PeoplePage';
import { PersonStatus } from '../features/people/types/person';
import {
  PAGE_SIZE_OPTIONS,
  DEFAULT_PAGE_SIZE,
  ALL_STATUSES,
} from '../utils/constants';

export type PeopleSearch = {
  q: string;
  status: PersonStatus[];
  page: number;
  pageSize: number;
};

/**
 * Validates and normalises the People list's URL search params.
 *
 * This keeps search text, status filters, page, and page size all
 * synced to the URL — so filtered/paginated views are bookmarkable,
 * shareable, and survive the back button.
 */
const validatePeopleSearch = (
  search: Record<string, unknown>
): PeopleSearch => {
  const q = typeof search.q === 'string' ? search.q : '';

  const page = Number(search.page);
  const safePage = Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;

  const pageSize = Number(search.pageSize);
  const safePageSize = (PAGE_SIZE_OPTIONS as readonly number[]).includes(
    pageSize
  )
    ? pageSize
    : DEFAULT_PAGE_SIZE;

  const rawStatus = Array.isArray(search.status)
    ? search.status
    : search.status
      ? [search.status]
      : [];

  const status = rawStatus.filter((value): value is PersonStatus =>
    (ALL_STATUSES as string[]).includes(value as string)
  );

  return { q, status, page: safePage, pageSize: safePageSize };
};

const rootRoute = createRootRoute({
  component: () => (
    <>
      <AppHeader />
      <Outlet />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: validatePeopleSearch,
  component: PeoplePage,
});

const newPersonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/people/new',
  component: AddEditPeoplePage,
});

const editPersonRoute = createRoute({
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
      search: { q: '', status: [], page: 1, pageSize: DEFAULT_PAGE_SIZE },
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

export { indexRoute, editPersonRoute, newPersonRoute };
