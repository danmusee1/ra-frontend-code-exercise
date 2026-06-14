import { ReactElement } from 'react';

import { usePeople } from '../../hooks/usePeople';
import { getRouteApi } from '@tanstack/react-router';
import { Person, PersonStatus } from '../../types/person';
import { Button } from '../../shared/components/ui/Button';
import { StatusBadge } from '../../shared/components/ui/StatusBadge';
import { formatSalary } from '../../utils/format';
import { Avatar } from '../../shared/components/ui/Avatar';
import { indexRoute } from '../../route/route-tree';
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

const capitalizeFirst = (text: string | undefined): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
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
    <>
      <table className="table-fixed w-full border-collapse">
        <thead>
          <tr className="bg-[var(--colors-gray-300)] text-[var(--colors-darkBlue)] font-semibold">
            <th className="whitespace-nowrap px-4 py-3 text-[1.2rem] text-left">Name</th>
            <th className="px-4 py-3 text-[1.2rem] text-left">Role</th>
            <th className="px-4 py-3 text-[1.2rem] text-left">Type</th>
            <th className="px-4 py-3 text-[1.2rem] text-left">Status</th>
            <th className="px-4 py-3 text-[1.2rem] text-left">Country</th>
            <th className="px-4 py-3 text-[1.2rem] text-left">Salary</th>
          </tr>
        </thead>

        {isLoading && (
          <tbody className="relative bg-[var(--colors-blank)]">
            <tr>
              <td className="h-[200px] text-center" colSpan={6}>
                <span className="text-[1.6rem] font-medium">Loading...</span>
              </td>
            </tr>
          </tbody>
        )}

        {!isLoading && (
          <tbody className={isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            {people.map((person) => (
              <tr key={person.id} className="transition-colors hover:bg-[var(--colors-gray-100)]">
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">
                  <div className="flex items-center gap-2 text-nowrap">
                     <Avatar name={person.name} seed={person.id} /> {person.name}
                    </div>
                 
                  
                  </td>
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">{person.jobTitle}</td>
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">{capitalizeFirst(person.employment)}</td>
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">{StatusBadge({ status: person.status })}</td>
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">{person.country}</td>
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">{formatSalary(person.salary, person.currency)}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>

 
    </>
  );
};
