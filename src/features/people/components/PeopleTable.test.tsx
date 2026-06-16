import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createTestRouter, TestRouterRoot } from '../../../routes/renderWithRouter';
import { expectNoA11yViolations } from '../../../test/utils/A11y';
import { Person } from '../types/person';
import { PeopleTable } from './PeopleTable';

const people: Person[] = [
  {
    id: 1,
    name: 'Ada Lovelace',
    jobTitle: 'Engineer',
    employment: 'full_time',
    status: 'active',
    photo:'',
    country: 'UK',
    salary: 120000,
    currency: 'USD',
  },
  {
    id: 2,
    name: 'Grace Hopper',
    jobTitle: 'Admiral',
    employment: 'contractor',
    status: 'onboarding',
    photo:'',
    country: 'US',
    salary: 95000,
    currency: 'USD',
  },
];

const defaultProps = {
  isLoading: false,
  isFetching: false,
  isError: false,
  pageSize: 10,
  hasActiveFilters: false,
  onRetry: vi.fn(),
  onClearFilters: vi.fn(),
  onDeleteClick: vi.fn(),
};

/** PeopleTable renders a <Link>, so it needs a router context to mount. */
const renderTable = (props: Partial<typeof defaultProps> & { people: Person[] }) => {
  const router = createTestRouter(() => (
    <PeopleTable {...defaultProps} {...props} />
  ));
  return render(<TestRouterRoot router={router} />);
};

describe('PeopleTable', () => {
  it('renders a row per person with their data', () => {
    renderTable({ people });

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('Full Time')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('UK')).toBeInTheDocument();
    expect(screen.getByText('Grace Hopper')).toBeInTheDocument();
  });

  it('renders skeleton rows while loading, capped at the page size or 8', () => {
    renderTable({ people: [], isLoading: true, pageSize: 5 });

    const rows = screen.getAllByRole('row', { hidden: true });
    // header row + 5 skeleton rows
    expect(rows).toHaveLength(6);
  });

  it('caps skeleton rows at 8 even when pageSize is larger', () => {
    renderTable({ people: [], isLoading: true, pageSize: 50 });

    const rows = screen.getAllByRole('row', { hidden: true });
    expect(rows).toHaveLength(9); // header + 8 skeletons
  });

  it('shows an error state with a retry button when isError is true', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    renderTable({ people: [], isError: true, onRetry });

    expect(
      screen.getByText('Something went wrong while loading people.')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('shows an empty state without a clear-filters button when there are no active filters', () => {
    renderTable({ people: [], hasActiveFilters: false });

    expect(screen.getByText('No team members yet.')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Clear filters' })
    ).not.toBeInTheDocument();
  });

  it('shows an empty state with a clear-filters button when filters are active', async () => {
    const user = userEvent.setup();
    const onClearFilters = vi.fn();

    renderTable({ people: [], hasActiveFilters: true, onClearFilters });

    expect(
      screen.getByText('No team members match your search and filters.')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });

  it('calls onDeleteClick with the corresponding person when remove is clicked', async () => {
    const user = userEvent.setup();
    const onDeleteClick = vi.fn();

    renderTable({ people, onDeleteClick });

    await user.click(screen.getByRole('button', { name: 'Remove Ada Lovelace' }));
    expect(onDeleteClick).toHaveBeenCalledWith(people[0]);
  });

  it('links each row name to the edit route for that person', () => {
    renderTable({ people });

    const link = screen.getByRole('link', { name: 'Edit Ada Lovelace' });
    expect(link).toHaveAttribute('href', '/people/edit/1');
  });

  it('announces loading/result counts via a live region for screen readers', () => {
    renderTable({ people });

    expect(screen.getByRole('status')).toHaveTextContent(
      'Showing 2 team members.'
    );
  });

  it('announces a singular count when exactly one person is shown', () => {
    renderTable({ people: [people[0]] });

    expect(screen.getByRole('status')).toHaveTextContent(
      'Showing 1 team member.'
    );
  });

  it('marks the table as busy while fetching new data', () => {
    renderTable({ people, isFetching: true });

    expect(screen.getByRole('grid')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Refreshing team members…'
    );
  });

  it('exposes column headers with the correct scope for screen readers', () => {
    renderTable({ people });

    const headerRow = screen.getAllByRole('row')[0];
    const headers = within(headerRow).getAllByRole('columnheader');
    expect(headers.map((h) => h.textContent)).toEqual([
      'Name',
      'Role',
      'Type',
      'Status',
      'Country',
      'Salary',
      '',
    ]);
  });

  it('has no detectable accessibility violations with data rendered', async () => {
    const { container } = renderTable({ people });
    await expectNoA11yViolations(container);
  });

  it('has no detectable accessibility violations in the empty state', async () => {
    const { container } = renderTable({ people: [] });
    await expectNoA11yViolations(container);
  });

  it('has no detectable accessibility violations in the error state', async () => {
    const { container } = renderTable({ people: [], isError: true });
    await expectNoA11yViolations(container);
  });
});