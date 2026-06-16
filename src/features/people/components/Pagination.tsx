import { ReactElement } from 'react';
import ChevronLeftIcon from '@/icons/chevron-left.svg?react';
import ChevronRightIcon from '@/icons/chevron-right.svg?react';
import ChevronsLeftIcon from '@/icons/chevrons-left.svg?react';
import ChevronsRightIcon from '@/icons/chevrons-right.svg?react';
import ChevronDownIcon from '@/icons/chevron-down.svg?react';
import { PAGE_SIZE_OPTIONS } from '../../../utils/constants';

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  disabled?: boolean;
};

const ICON_BUTTON_CLASSES =
  'flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-full border border-[var(--colors-gray-300)] ' +
  'text-[var(--colors-gray-600)] transition-colors duration-150 ' +
  'hover:border-[var(--colors-brand)] hover:text-[var(--colors-brand)] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--colors-brand)] focus-visible:ring-offset-1 ' +
  'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--colors-gray-300)] disabled:hover:text-[var(--colors-gray-600)]';

const SELECT_CLASSES =
  'appearance-none rounded-full border border-[var(--colors-gray-300)] bg-[var(--colors-blank)] ' +
  'py-[0.6rem] pl-[1.2rem] pr-[3rem] text-[1.4rem] text-[var(--colors-gray-700)] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--colors-brand)] focus-visible:ring-offset-1 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

export const Pagination = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  disabled,
}: PaginationProps): ReactElement => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <div className="flex flex-wrap items-center justify-between gap-[1.6rem] px-[2rem] py-[1.6rem]">
      <p className="text-[1.4rem] text-[var(--colors-gray-600)]">
        {total === 0 ? (
          'No records'
        ) : (
          <>
            {start}-{end} of {total} record{total === 1 ? '' : 's'}
          </>
        )}
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-[0.8rem]">
        <button
          type="button"
          aria-label="First page"
          className={ICON_BUTTON_CLASSES}
          disabled={disabled || isFirstPage}
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeftIcon className="h-[1.6rem] w-[1.6rem]" aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label="Previous page"
          className={ICON_BUTTON_CLASSES}
          disabled={disabled || isFirstPage}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon className="h-[1.6rem] w-[1.6rem]" aria-hidden="true" />
        </button>

        <div className="relative">
          <label className="sr-only" htmlFor="pagination-page">
            Page
          </label>
          <select
            id="pagination-page"
            className={SELECT_CLASSES}
            value={page}
            disabled={disabled}
            onChange={(event) => onPageChange(Number(event.target.value))}
          >
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <option key={pageNumber} value={pageNumber}>
                {pageNumber}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none absolute right-[1rem] top-1/2 h-[1rem] w-[1rem] -translate-y-1/2 text-[var(--colors-gray-500)]"
          />
        </div>

        <button
          type="button"
          aria-label="Next page"
          className={ICON_BUTTON_CLASSES}
          disabled={disabled || isLastPage}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRightIcon className="h-[1.6rem] w-[1.6rem]" aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label="Last page"
          className={ICON_BUTTON_CLASSES}
          disabled={disabled || isLastPage}
          onClick={() => onPageChange(totalPages)}
        >
          <ChevronsRightIcon className="h-[1.6rem] w-[1.6rem]" aria-hidden="true" />
        </button>

        <div className="relative ml-[0.8rem]">
          <label className="sr-only" htmlFor="pagination-page-size">
            Rows per page
          </label>
          <select
            id="pagination-page-size"
            className={SELECT_CLASSES}
            value={pageSize}
            disabled={disabled}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                Rows {size}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none absolute right-[1rem] top-1/2 h-[1rem] w-[1rem] -translate-y-1/2 text-[var(--colors-gray-500)]"
          />
        </div>
      </nav>
    </div>
  );
};