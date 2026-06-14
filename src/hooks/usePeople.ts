import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { type PeopleQueryParams, fetchPeople } from '../services/people';

/**
 * Structured query keys so we can invalidate broadly (`peopleKeys.all`)
 * or precisely (`peopleKeys.list(params)`).
 */
export const peopleKeys = {
  all: ['people'] as const,
  lists: () => [...peopleKeys.all, 'list'] as const,
  list: (params: PeopleQueryParams) => [...peopleKeys.lists(), params] as const,
};

/**
 * Fetches a page of people for the given filters/pagination.
 *
 * Uses `placeholderData: keepPreviousData` so that changing the page or
 * filters doesn't flash a full loading state — the previous page stays
 * visible (dimmed via `isFetching`) until the new data arrives.
 */
export const usePeople = (params: PeopleQueryParams) => {
  return useQuery({
    queryKey: peopleKeys.list(params),
    queryFn: ({ signal }) => fetchPeople(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 30000,
  });
};

