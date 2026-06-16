import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  type PeopleQueryParams,
  fetchPeople,
  type PeoplePage,
  deletePerson,
} from '../api/people.api';

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

type DeletePersonContext = {
  previousPages: Array<[readonly unknown[], PeoplePage | undefined]>;
};

/**
 * Deletes a person with an optimistic update: the row disappears
 * immediately from every cached list page, and the total count decrements.
 * On error, all affected pages are rolled back. On success, the people
 * lists are invalidated so pagination totals stay correct server-side.
 */
export const useDeletePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePerson(id),

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: peopleKeys.lists() });

      const previousPages = queryClient.getQueriesData<PeoplePage>({
        queryKey: peopleKeys.lists(),
      });

      for (const [queryKey, page] of previousPages) {
        if (!page) continue;

        queryClient.setQueryData<PeoplePage>(queryKey, {
          people: page.people.filter((person) => person.id !== id),
          total: Math.max(0, page.total - 1),
        });
      }

      return { previousPages } satisfies DeletePersonContext;
    },

    onError: (_error, _id, context) => {
      context?.previousPages.forEach(([queryKey, page]) => {
        queryClient.setQueryData(queryKey, page);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: peopleKeys.lists() });
    },
  });
};
