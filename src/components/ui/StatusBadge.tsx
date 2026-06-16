import { ReactElement } from 'react';
import { PersonStatus } from '../../../features/people/types/person';
import { STATUS_CONFIG } from '../../../utils/constants';

type StatusBadgeProps = {
  status: PersonStatus;
};

export const StatusBadge = ({ status }: StatusBadgeProps): ReactElement => {
  const { label, dotClassName } = STATUS_CONFIG[status];

  return (
    <span className="inline-flex items-center gap-2 text-[1.4rem] text-[var(--colors-gray-700)]">
      <span
        aria-hidden="true"
        className={`h-[0.8rem] w-[0.8rem] rounded-full ${dotClassName}`}
      />
      {label}
    </span>
  );
};
