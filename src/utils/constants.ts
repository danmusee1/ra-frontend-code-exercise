import { PersonStatus } from "../types/person";

export const ALL_STATUSES: PersonStatus[] = ['active', 'onboarding', 'offboarded'];

export const STATUS_CONFIG: Record<
  PersonStatus,
  { label: string; dotClassName: string }
> = {
  active: {
    label: 'Active',
    dotClassName:
      'bg-[linear-gradient(90deg,#58A30D_50%,#8DE13A_50%)]',
  },
  onboarding: {
    label: 'Onboarding',
    dotClassName:
      'bg-[linear-gradient(90deg,#F59E0B_50%,#FBBF24_50%)]',
  },
  offboarded: {
    label: 'Offboarded',
    dotClassName:
      'bg-[linear-gradient(90deg,#4B5865_50%,#9AA6B2_50%)]',
  },
};
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
export const DEFAULT_PAGE_SIZE = 25;