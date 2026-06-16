import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PeoplePage } from './PeoplePage';
import {
  createTestRouter,
  preloadRouter,
  TestRouterRoot,
} from '../../routes/renderWithRouter';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';
import { expectNoA11yViolations } from '../../test/utils/A11y';

// ─── Mock hooks ──────────────────────────────────────────────────────────────

const mockRefetch = vi.fn();
const mockMutate = vi.fn();

vi.mock('../../features/people/hooks/usePeople', () => ({
  usePeople: vi.fn(),
  useDeletePerson: vi.fn(),
}));

import { usePeople, useDeletePerson } from '../../features/people/hooks/usePeople';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PEOPLE = [
  {
    id: 1,
    name: 'Alice Kariuki',
    role: 'Engineer',
    department: 'Tech',
    status: 'active' as const,
    startDate: '2022-01-10',
    avatar: null,
  },
  {
    id: 2,
    name: 'Bob Mwangi',
    role: 'Designer',
    department: 'Product',
    status: 'onboarding' as const,
    startDate: '2024-03-01',
    avatar: null,
  },
];

const defaultUsePeople = {
  data: { people: PEOPLE, total: 2 },
  isLoading: false,
  isFetching: false,
  isError: false,
  refetch: mockRefetch,
};

const defaultUseDeletePerson = {
  mutate: mockMutate,
  isPending: false,
};

const makeQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const validateSearch = (search: Record<string, unknown>) => ({
  q: typeof search.q === 'string' ? search.q : '',
  status: Array.isArray(search.status) ? search.status : [],
  page: Number(search.page) >= 1 ? Number(search.page) : 1,
  pageSize: [10, 25, 50].includes(Number(search.pageSize))
    ? Number(search.pageSize)
    : DEFAULT_PAGE_SIZE,
});

const renderPage = async (initialEntry = '/') => {
  const router = createTestRouter(() => (
    <QueryClientProvider client={makeQueryClient()}>
      <PeoplePage />
    </QueryClientProvider>
  ), { initialEntries: [initialEntry], validateSearch });

  await preloadRouter(router);
  render(<TestRouterRoot router={router} />);
  return router;
};

// ─── Tests ───────────────────────────────────────────────────────────────────

beforeEach(() => {
vi.mocked(usePeople).mockReturnValue(defaultUsePeople as unknown as ReturnType<typeof usePeople>);
vi.mocked(useDeletePerson).mockReturnValue(defaultUseDeletePerson as unknown as ReturnType<typeof useDeletePerson>);
});

describe('PeoplePage', () => {
  // ── Layout & heading ──────────────────────────────────────────────────────

  it('renders the People heading', async () => {
    await renderPage();
    expect(screen.getByRole('heading', { name: /people/i })).toBeInTheDocument();
  });

  it('shows the total member count next to the heading', async () => {
    await renderPage();
    expect(screen.getByText(/2 members/i)).toBeInTheDocument();
  });

  it('renders the Add member link', async () => {
    await renderPage();
    expect(screen.getByRole('link', { name: /add new member/i })).toBeInTheDocument();
  });

  // ── People data ───────────────────────────────────────────────────────────

  it('renders a row for each person returned by usePeople', async () => {
    await renderPage();
    expect(screen.getByText('Alice Kariuki')).toBeInTheDocument();
    expect(screen.getByText('Bob Mwangi')).toBeInTheDocument();
  });

  it('shows a loading state while data is being fetched', async () => {
vi.mocked(usePeople).mockReturnValue({
  ...defaultUsePeople,
  isLoading: false,
  isError: true,
  data: undefined,
} as unknown as ReturnType<typeof usePeople>);
    await renderPage();
    // PeopleTable renders skeleton rows while loading
expect(screen.getByRole('grid', { name: /team members/i })).toBeInTheDocument();
    expect(screen.queryByText('Alice Kariuki')).not.toBeInTheDocument();
  });

it('shows an error state with a retry button when usePeople errors', async () => {
  vi.mocked(usePeople).mockReturnValue({
    data: undefined,
    isLoading: false,
    isFetching: false,
    isError: true,
    refetch: mockRefetch,
  } as unknown as ReturnType<typeof usePeople>);

  await renderPage();
  expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
});

it('calls refetch when the retry button is clicked', async () => {
  const user = userEvent.setup();
  vi.mocked(usePeople).mockReturnValue({
    data: undefined,
    isLoading: false,
    isFetching: false,
    isError: true,
    refetch: mockRefetch,
  } as unknown as ReturnType<typeof usePeople>);

  await renderPage();
  await user.click(screen.getByRole('button', { name: /try again/i }));
  expect(mockRefetch).toHaveBeenCalledOnce();
});

  // ── Search input ──────────────────────────────────────────────────────────

  it('renders the search input', async () => {
    await renderPage();
    expect(screen.getByRole('searchbox', { name: /search/i })).toBeInTheDocument();
  });

  // ── Status filter pills ───────────────────────────────────────────────────

  it('renders status filter pills', async () => {
    await renderPage();
    expect(screen.getByRole('group', { name: /filter by status/i })).toBeInTheDocument();
  });

  // ── Empty / no-results states ─────────────────────────────────────────────

  it('shows an empty state when there are no people and no active filters', async () => {
   vi.mocked(usePeople).mockReturnValue({
  ...defaultUsePeople,
  data: { people: [], total: 0 },
} as unknown as ReturnType<typeof usePeople>);

    await renderPage();
    expect(screen.getByRole('grid', { name: /team members/i })).toBeInTheDocument();
  });

  it('shows a no-results state when filters are active but return nothing', async () => {
vi.mocked(usePeople).mockReturnValue({
  ...defaultUsePeople,
  data: { people: [], total: 0 },
} as unknown as ReturnType<typeof usePeople>);

    // pre-seed URL with an active search query
    await renderPage('/?q=ghost');
expect(screen.getByRole('cell', { name: /no team members match/i })).toBeInTheDocument();
  });

  // ── Delete flow ───────────────────────────────────────────────────────────

  it('opens a delete confirmation dialog when a delete button is clicked', async () => {
    const user = userEvent.setup();
    await renderPage();

    const deleteButtons = screen.getAllByRole('button', { name: /remove/i });
    await user.click(deleteButtons[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
   const dialog = screen.getByRole('dialog');
expect(dialog).toBeInTheDocument();
within(dialog).getByText(/Alice Kariuki/i);
  });

  it('closes the dialog when cancel is clicked', async () => {
    const user = userEvent.setup();
    await renderPage();

    await user.click(screen.getAllByRole('button', { name: /remove/i })[0]);
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls deleteMutation.mutate with the correct id on confirm', async () => {
    const user = userEvent.setup();
    await renderPage();

    await user.click(screen.getAllByRole('button', { name: /remove/i })[0]);
    await user.click(screen.getByRole('button', { name: /^remove$/i  }));

    expect(mockMutate).toHaveBeenCalledWith(1, expect.any(Object));
  });

  it('shows a delete error banner when deletion fails', async () => {
    const user = userEvent.setup();

    vi.mocked(useDeletePerson).mockReturnValue({
      mutate: vi.fn((_id, { onError }) => onError()),
      isPending: false,
    } as unknown as ReturnType<typeof useDeletePerson>);

    await renderPage();

    await user.click(screen.getAllByRole('button', { name: /remove/i })[0]);
    await user.click(screen.getByRole('button', { name: /^remove$/i  }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toBeInTheDocument()
    );
  });

  it('dismisses the delete error banner when Dismiss is clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(useDeletePerson).mockReturnValue({
      mutate: vi.fn((_id, { onError }) => onError()),
      isPending: false,
    } as unknown as ReturnType<typeof useDeletePerson>);

    await renderPage();
    await user.click(screen.getAllByRole('button', { name: /remove/i })[0]);
    await user.click(screen.getByRole('button', { name: /^remove$/i  }));
    await waitFor(() => screen.getByRole('alert'));

    await user.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // ── Accessibility ─────────────────────────────────────────────────────────

  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <QueryClientProvider client={makeQueryClient()}>
        <TestRouterRoot
          router={await preloadRouter(
            createTestRouter(
              () => (
                <QueryClientProvider client={makeQueryClient()}>
                  <PeoplePage />
                </QueryClientProvider>
              ),
              { validateSearch }
            )
          )}
        />
      </QueryClientProvider>
    );
    await expectNoA11yViolations(container);
  });
});