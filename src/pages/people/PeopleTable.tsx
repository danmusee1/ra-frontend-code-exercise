
import { ReactElement } from 'react';

import { usePeople } from '../../hooks/usePeople';
import { indexRoute } from '../../routes/route-tree';
import { getRouteApi } from '@tanstack/react-router';
import { PersonStatus } from '../../types/person';

const routeApi = getRouteApi('/');
const capitalizeFirst = (text: string | undefined): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const PeopleTable = (): ReactElement => {
   const { q, status, page = 1, pageSize = 10 } = routeApi.useSearch() as {
    q?: string;
    status?: PersonStatus;
    page?: number;
    pageSize?: number;
  };
  const navigate = indexRoute.useNavigate();

  const { data, isLoading, isFetching } = usePeople({
    search: q ?? '',
    status: status ? [status] : [],
    page,
    pageSize,
  });

  const people = data?.people ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handlePageChange = (nextPage: number): void => {
    navigate({
      search: (prev) => ({ ...prev, page: nextPage }),
    });
  };

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
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">{person.name}</td>
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">{person.jobTitle}</td>
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">{capitalizeFirst(person.employment)}</td>
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">{capitalizeFirst(person.status)}</td>
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">{person.country}</td>
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">{person.salary}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>

      {!isLoading && (
        <div className="flex justify-center mt-4">
          <button
            className="px-3 py-2 mx-1 rounded border bg-white"
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="px-3 py-2 mx-1">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-3 py-2 mx-1 rounded border bg-white"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};
