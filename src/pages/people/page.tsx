import { ReactElement, useState, ChangeEvent } from 'react';
import { PeopleTable } from './PeopleTable';

export const PeoplePage = (): ReactElement => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    setStatusFilter(checked ? status : '');
  };

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

        <div className="flex gap-3">
          <label className="inline-flex items-center px-3 py-2 rounded-lg border border-[var(--colors-gray-400)] bg-[var(--colors-blank)] gap-2 cursor-pointer transition-colors duration-200 hover:border-[var(--colors-brand)]">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={statusFilter === 'active'}
              onChange={(e) => handleStatusFilterChange('active', e.target.checked)}
            />
            <span className="w-[18px] h-[18px] rounded-[4px] border-2 border-[var(--colors-gray-400)] bg-[var(--colors-blank)] flex-shrink-0" />
            <span className="text-[1.4rem] text-[var(--colors-gray-700)] select-none">Active</span>
          </label>

          <label className="inline-flex items-center px-3 py-2 rounded-lg border border-[var(--colors-gray-400)] bg-[var(--colors-blank)] gap-2 cursor-pointer transition-colors duration-200 hover:border-[var(--colors-brand)]">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={statusFilter === 'onboarding'}
              onChange={(e) => handleStatusFilterChange('onboarding', e.target.checked)}
            />
            <span className="w-[18px] h-[18px] rounded-[4px] border-2 border-[var(--colors-gray-400)] bg-[var(--colors-blank)] flex-shrink-0" />
            <span className="text-[1.4rem] text-[var(--colors-gray-700)] select-none">Onboarding</span>
          </label>

          <label className="inline-flex items-center px-3 py-2 rounded-lg border border-[var(--colors-gray-400)] bg-[var(--colors-blank)] gap-2 cursor-pointer transition-colors duration-200 hover:border-[var(--colors-brand)]">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={statusFilter === 'offboarded'}
              onChange={(e) => handleStatusFilterChange('offboarded', e.target.checked)}
            />
            <span className="w-[18px] h-[18px] rounded-[4px] border-2 border-[var(--colors-gray-400)] bg-[var(--colors-blank)] flex-shrink-0" />
            <span className="text-[1.4rem] text-[var(--colors-gray-700)] select-none">Offboarded</span>
          </label>
        </div>
      </div>

      <PeopleTable search={search} />
    </main>
  );
};
