import { ReactElement } from 'react';
import { getAvatarColors, getInitials } from '../../utils/format';

type AvatarProps = {
  name: string;
  seed: number;
};

export const Avatar = ({ name, seed }: AvatarProps): ReactElement => {
  const { bg, fg } = getAvatarColors(seed);

  return (
    <span
      aria-hidden="true"
      className="flex h-[2.8rem] w-[2.8rem] flex-shrink-0 items-center justify-center rounded-full text-[1.2rem] font-semibold"
      style={{ backgroundColor: bg, color: fg }}
    >
      {getInitials(name)}
    </span>
  );
};
