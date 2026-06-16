import { ReactElement, useState, useEffect } from 'react';
import { PeopleTable } from '../../features/people/components/PeopleTable';
import { StatusFilterPills } from '../../features/people/components/StatusFilterPills';
import { Person, PersonStatus } from '../../features/people/types/person';
import {
  useDeletePerson,
  usePeople,
} from '../../features/people/hooks/usePeople';
import { useDebounce } from '../../features/people/hooks/useDebounce';
import { DeleteConfirmDialog } from '../../features/people/components/DeleteConfirmDialog';
import { SearchInput } from '../../features/people/components/SearchInput';
import { Link } from '@tanstack/react-router';
import UserPlusIcon from '@/icons/user-plus.svg?react';
import { getButtonClasses } from '../../components/ui/ButtonStyles';
import { Pagination } from '../../features/people/components/Pagination';
import { indexRoute, PeopleSearch } from '../../routes/route-tree';

export const PeoplePage = (): ReactElement => {
  const search = indexRoute.useSearch();
  const navigate = indexRoute.useNavigate();

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
    <main className=" overflow-auto bg-[#F3F4F8] lg:p-20 p-10">
      <div className="mb-[2.4rem] flex flex-wrap items-center justify-between gap-[1.6rem]">
        <h1 className="module-title  font-bold">
          People
          {data && (
            <span className="ml-[0.8rem] text-[1.6rem] font-normal text-[var(--colors-gray-600)]">
              ({data.total} {data.total === 1 ? 'member' : 'members'})
            </span>
          )}
        </h1>

        <Link
          to="/people/new"
          className={`
    ${getButtonClasses('primary')}
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-[var(--colors-brand)]
    focus-visible:ring-offset-2
    focus-visible:ring-offset-[var(--colors-bgBase)]
    transition
    motion-reduce:transition-none
    select-none
    button-text
  `}
          aria-label="Add new member"
        >
          <UserPlusIcon
            className="button-icon"
            aria-hidden="true"
            focusable="false"
          />
          Add member
        </Link>
      </div>

      {deleteError && (
        <div
          role="alert"
          className="mb-[1.6rem] flex items-center justify-between gap-[1.6rem] rounded-[0.8rem]
            border border-[var(--colors-redPink)]/30 bg-[var(--colors-redPink)]/10 px-[1.6rem] py-[1.2rem]
            text-[1.4rem] text-[var(--colors-redPink)]"
        >
          {deleteError}
          <button
            type="button"
            onClick={() => setDeleteError(null)}
            aria-label="Dismiss"
            className="text-[1.2rem] font-medium underline focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-[var(--colors-brand)] rounded-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-[1.2rem] border border-[var(--colors-gray-200)] bg-[var(--colors-blank)]">
        <div className="flex flex-wrap items-center justify-between gap-[1.6rem] p-[2rem]">
          <SearchInput value={searchInput} onChange={setSearchInput} />
          <StatusFilterPills
            value={search.status}
            onChange={handleStatusChange}
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

        <div className="border-t border-[var(--colors-gray-100)]">
          <Pagination
            page={search.page}
            pageSize={search.pageSize}
            total={data?.total ?? 0}
            onPageChange={(page) => updateSearch({ page })}
            onPageSizeChange={(pageSize) => updateSearch({ pageSize, page: 1 })}
            disabled={isLoading}
          />
        </div>
      </div>

      <DeleteConfirmDialog
        person={personToDelete}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPersonToDelete(null)}
      />
    </main>
  );
};
