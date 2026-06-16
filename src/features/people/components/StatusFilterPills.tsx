import { ReactElement } from 'react';
import CheckIcon from '@/icons/check.svg?react';
import { PersonStatus } from '../types/person';
import { ALL_STATUSES, STATUS_CONFIG } from '../../../utils/constants';

type StatusFilterPillsProps = {
  value: PersonStatus[];
  onChange: (value: PersonStatus[]) => void;
};

export const StatusFilterPills = ({
  value,
  onChange,
}: StatusFilterPillsProps): ReactElement => {
  const toggle = (status: PersonStatus, checked: boolean) => {
    onChange(checked ? [...value, status] : value.filter((s) => s !== status));
  };

  return (
    <div
      role="group"
      aria-label="Filter by status"
      className="flex flex-wrap gap-[0.8rem]"
    >
      {ALL_STATUSES.map((status) => {
        const checked = value.includes(status);

        return (
          <label
            key={status}
            className={`
    inline-flex cursor-pointer items-center gap-[0.8rem]
    rounded-full border px-[1.4rem] py-[0.7rem]
    text-[1.4rem] transition-colors duration-150

    border-[var(--colors-gray-300)]
    bg-[var(--colors-blank)]
    text-[var(--colors-gray-700)]

    hover:border-[var(--colors-brand)]
    hover:bg-[var(--colors-brand-subtle)]

    has-[:focus-visible]:ring-2
    has-[:focus-visible]:ring-[var(--colors-brand)]
    has-[:focus-visible]:ring-offset-1
    has-[:focus-visible]:bg-[var(--colors-brand-subtle)]
  `}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              onChange={(event) => toggle(status, event.target.checked)}
            />

            {/* Checkbox UI */}
            {checked ? (
              <span
                className="
        flex h-[1.3rem] w-[1.3rem]
        flex-shrink-0 items-center justify-center
        rounded-[0.3rem]
        bg-[var(--colors-brand)]
        text-[var(--colors-blank)]
      "
              >
                <CheckIcon aria-hidden="true" className="h-[1rem] w-[1rem]" />
              </span>
            ) : (
              <span
                className="
        h-[1.3rem] w-[1.3rem]
        flex-shrink-0
        rounded-[0.3rem]
        border border-[var(--colors-gray-400)]
        bg-[var(--colors-blank)]
      "
              />
            )}

            {/* Label */}
            {STATUS_CONFIG[status].label}
          </label>
        );
      })}
    </div>
  );
};
