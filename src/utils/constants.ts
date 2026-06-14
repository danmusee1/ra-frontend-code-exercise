import { PersonStatus } from "../types/person";

export const ALL_STATUSES: PersonStatus[] = ['active', 'onboarding', 'offboarded'];

export const STATUS_CONFIG: Record<PersonStatus, { label: string; dotClassName: string }> = {
  active: { label: 'Active', dotClassName: 'bg-emerald-500' },
  onboarding: { label: 'Onboarding', dotClassName: 'bg-amber-500' },
  offboarded: { label: 'Offboarded', dotClassName: 'bg-[var(--colors-gray-400)]' },
};
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
export const DEFAULT_PAGE_SIZE = 25;