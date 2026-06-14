import { ReactElement, useState, ChangeEvent } from 'react';
import { PeopleTable } from './PeopleTable';
import { StatusFilterPills } from './components/StatusFilterPills';
import { PersonStatus } from '../../types/person';

export const PeoplePage = (): ReactElement => {
  const [search, setSearch] = useState('');
const [statusFilter, setStatusFilter] = useState<PersonStatus | undefined>();
  // const handleStatusFilterChange = (status: string, checked: boolean) => {
  //   setStatusFilter(checked ? status : '');
  // };

  return (
    <main className="mx-auto w-full max-w-[var(--layout-width)] overflow-auto">
      <p className="text-[30px] font-medium my-6">People</p>

      <div className="flex justify-between mb-4">
        <div className="flex-1">
          <input
            className="w-full px-3 py-2 rounded border border-[var(--colors-gray-300)] bg-white"
            placeholder="Search people..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>
        <StatusFilterPills value={statusFilter ? [statusFilter] : []} onChange={(statuses) => setStatusFilter(statuses[0] || '')} />

    
      </div>

      <PeopleTable />
    </main>
  );
};
