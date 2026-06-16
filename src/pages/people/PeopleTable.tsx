import { ReactElement } from 'react';
import { Person } from '../../types/person';
import { Button } from '../../shared/components/ui/Button';
import { StatusBadge } from '../../shared/components/ui/StatusBadge';
import { formatSalary, toTitleCase } from '../../utils/format';
import { Avatar } from '../../shared/components/ui/Avatar';
import { Link } from '@tanstack/react-router';
import TrashIcon from '@/icons/trash.svg?react';



const COLUMNS = ['Name', 'Role', 'Type', 'Status', 'Country', 'Salary'] as const;

type PeopleTableProps = {
  people: Person[];
  /** True only on the very first load (no data to show yet). */
  isLoading: boolean;
  /** True while a background refetch is in flight (filters/page changed). */
  isFetching: boolean;
  isError: boolean;
  /** Used to size the loading skeleton to match the requested page size. */
  pageSize: number;
  /** Whether any search/status filters are currently applied. */
  hasActiveFilters: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
  onDeleteClick: (person: Person) => void;
};



export const PeopleTable = ({
  people,
  isLoading,
  isFetching,
  isError,
  pageSize,
  hasActiveFilters,
  onRetry,
  onClearFilters,
  onDeleteClick,
}: PeopleTableProps): ReactElement => {

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[72rem] border-collapse text-left">
        <thead className="bg-[var(--colors-gray-50)]">
          <tr>
            {COLUMNS.map((column) => (
              <th
                key={column}
                scope="col"
                className={`whitespace-nowrap px-[2rem] py-[1.2rem] text-[1.2rem] font-semibold uppercase
                  tracking-wide text-[var(--colors-gray-500)]
                  ${column === 'Salary' ? 'text-right' : 'text-left'}`}
              >
                {column}
              </th>
            ))}
            {/* Visually hidden — the delete button gets its own accessible label per row */}
            <th scope="col" className="px-[1.2rem] py-[1.2rem]">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        <tbody
          aria-busy={isFetching}
          className={`bg-[var(--colors-blank)] transition-opacity duration-150 ${
            isFetching ? 'opacity-60' : 'opacity-100'
          }`}
        >
          {isLoading ? (
        <SkeletonRows rows={Math.min(pageSize, 8)} />
          ) : isError ? (
            <tr>
              <td colSpan={COLUMNS.length + 1} className="px-[2rem] py-[6rem] text-center">
                <p className="mb-[1.6rem] table-cell-text text-[var(--colors-gray-600)]">
                  Something went wrong while loading people.
                </p>
                <Button variant="secondary" onClick={onRetry}>
                  Try again
                </Button>
              </td>
            </tr>
          ) : people.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length + 1} className="px-[2rem] py-[6rem] text-center">
                <p className="mb-[1.6rem] table-cell-text text-[var(--colors-gray-600)]">
                  {hasActiveFilters
                    ? 'No team members match your search and filters.'
                    : 'No team members yet.'}
                </p>
                {hasActiveFilters && (
                  <Button variant="secondary" onClick={onClearFilters}>
                    Clear filters
                  </Button>
                )}
              </td>
            </tr>
          ) : (
            people.map((person) => (
              <tr
                key={person.id}
                className="group border-t border-[var(--colors-gray-100)] transition-colors hover:bg-[var(--colors-gray-50)]"
              >
                <td className="px-[2rem] py-[1.2rem]">
                  <Link
                    to="/people/edit/$id"
                    params={{ id: String(person.id) }}
                    className="flex items-center gap-[1.2rem] rounded-[0.6rem] table-cell-text font-medium
                      text-[var(--colors-gray-900)] outline-none
                      focus-visible:ring-2 focus-visible:ring-[var(--colors-brand)] focus-visible:ring-offset-2
                      group-hover:text-[var(--colors-brand)]"
                  >
                    <Avatar name={person.name} seed={person.id} />
                    {person.name}
                  </Link>
                </td>
                <td className="px-[2rem] py-[1.2rem] table-cell-text text-[var(--colors-gray-600)]">
                  {person.jobTitle}
                </td>
                <td className="px-[2rem] py-[1.2rem] table-cell-text text-[var(--colors-gray-600)]">
                  {toTitleCase(person.employment)}
                </td>
                <td className="px-[2rem] py-[1.2rem]">
                  <StatusBadge status={person.status} />
                </td>
                <td className="px-[2rem] py-[1.2rem] table-cell-text text-[var(--colors-gray-600)]">
                  {person.country}
                </td>
                <td className="px-[2rem] py-[1.2rem] text-right table-cell-text text-[var(--colors-gray-600)]">
                  {formatSalary(person.salary, person.currency)}
                </td>
                <td className="px-[1.2rem] py-[1.2rem]">
                  <button
                    type="button"
                    onClick={() => onDeleteClick(person)}
                    aria-label={`Remove ${person.name}`}
                    className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-full
                      text-[var(--colors-gray-400)] opacity-0 transition-opacity
                      hover:bg-[var(--colors-gray-100)] hover:text-[var(--colors-redPink)]
                      focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-[var(--colors-brand)]
                      group-hover:opacity-100 group-focus-within:opacity-100"
                  >
                    <TrashIcon className="h-[1.6rem] w-[1.6rem]" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};


const SkeletonRows = ({ rows }: { rows: number }): ReactElement => (
  <>
    {Array.from({ length: rows }, (_, index) => (
      <tr key={index} className="border-t border-[var(--colors-gray-100)]" aria-hidden="true">
        {COLUMNS.map((column) => (
          <td key={column} className="px-[2rem] py-[1.6rem]">
            <div
              className="h-[1.2rem] animate-pulse rounded-full bg-[var(--colors-gray-200)]"
              style={{ width: column === 'Name' ? '70%' : '55%', marginLeft: column === 'Salary' ? 'auto' : 0 }}
            />
          </td>
        ))}
        <td className="px-[1.2rem] py-[1.6rem]" />
      </tr>
    ))}
  </>
);
