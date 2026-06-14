import { ReactElement, useState, useEffect } from 'react';
import { PeopleTable } from './PeopleTable';
import { StatusFilterPills } from './components/StatusFilterPills';
import { Person, PersonStatus } from '../../types/person';
import { useDeletePerson, usePeople } from '../../hooks/usePeople';
import { indexRoute, PeopleSearch } from '../../route/route-tree';
import { useDebounce } from '../../hooks/useDebounce';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';

export const PeoplePage = (): ReactElement => {
  const search = indexRoute.useSearch();
  const navigate = indexRoute.useNavigate();
  const [statusFilter, setStatusFilter] = useState<PersonStatus | undefined>();

  const [searchInput, setSearchInput] = useState(search.q);
  const debouncedSearch = useDebounce(searchInput, 350);
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const updateSearch = (updates: Partial<PeopleSearch>) => {
    navigate({
      search: (prev) => ({ ...prev, ...updates }),
      replace: true,
    });
  };

  // Push the debounced search text into the URL (resetting to page 1).
  useEffect(() => {
    if (debouncedSearch !== search.q) {
      updateSearch({ q: debouncedSearch, page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Keep the input in sync if the URL changes from elsewhere (back/forward, links).
  useEffect(() => {
    setSearchInput(search.q);
  }, [search.q]);

  const { data, isLoading, isFetching, isError, refetch } = usePeople({
    search: search.q,
    status: search.status,
    page: search.page,
    pageSize: search.pageSize,
  });

  const deleteMutation = useDeletePerson();

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / search.pageSize))
    : 1;

  useEffect(() => {
    if (data && search.page > totalPages) {
      updateSearch({ page: totalPages });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, totalPages]);

  const hasActiveFilters = search.q.trim() !== '' || search.status.length > 0;

  const handleClearFilters = () => {
    setSearchInput('');
    updateSearch({ q: '', status: [], page: 1 });
  };

  const handleStatusChange = (status: PersonStatus[]) => {
    updateSearch({ status, page: 1 });
  };

  const handleConfirmDelete = () => {
    if (!personToDelete) return;
    const { id, name } = personToDelete;

    deleteMutation.mutate(id, {
      onSuccess: () => {
        setPersonToDelete(null);
        setDeleteError(null);
      },
      onError: () => {
        setPersonToDelete(null);
        setDeleteError(`Couldn't remove ${name}. Please try again.`);
      },
    });
  };

  return (
    <main className="mx-auto w-full max-w-[var(--layout-width)] overflow-auto">
      <p className="text-[30px] font-medium my-6">People</p>

      <div className="flex justify-between mb-4">
        <div className="flex-1">
          <input
            className="w-full px-3 py-2 rounded border border-[var(--colors-gray-300)] bg-white"
            placeholder="Search people..."
            value={search.q}
          />
        </div>
        <StatusFilterPills
          value={statusFilter ? [statusFilter] : []}
          onChange={(statuses) => setStatusFilter(statuses[0] || '')}
        />
      </div>

      <PeopleTable
        people={data?.people ?? []}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        pageSize={search.pageSize}
        hasActiveFilters={hasActiveFilters}
        onRetry={() => refetch()}
        onClearFilters={handleClearFilters}
        onDeleteClick={setPersonToDelete}
      />

      <DeleteConfirmDialog
        person={personToDelete}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPersonToDelete(null)}
      />
    </main>
  );
};
