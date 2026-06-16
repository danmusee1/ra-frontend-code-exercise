import axios, { AxiosError } from 'axios';
import type { Person, PersonStatus } from '../types/person';
import { API_BASE_URL } from '../../../utils/constants';

// ─── Axios instance ────────────────────────────────────────────────────────────
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Response interceptor — normalise errors
client.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response) {
      return Promise.reject(new ApiError(error.message, error.response.status));
    }
    return Promise.reject(error);
  }
);

// ─── Types ─────────────────────────────────────────────────────────────────────

export type SortField = 'name' | 'jobTitle' | 'salary' | 'country';
export type SortOrder = 'asc' | 'desc';

export type PeopleQueryParams = {
  search: string;
  status: PersonStatus[];
  page: number;
  pageSize: number;
  sort?: SortField;
  order?: SortOrder;
};

export type PeoplePage = {
  people: Person[];
  total: number;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// ─── API functions ─────────────────────────────────────────────────────────────

/**
 * Fetches a page of people from the mock API.
 *
 * Maps our query params onto json-server's conventions:
 * - `_page` / `_limit` for pagination (returns an `X-Total-Count` header)
 * - `name_like` for case-insensitive partial name search
 * - repeated `status=` params for an OR filter across statuses
 * - `_sort` / `_order` for sorting
 */
export const fetchPeople = async (
  params: PeopleQueryParams,
  signal?: AbortSignal
): Promise<PeoplePage> => {
  const searchParams = new URLSearchParams();

  searchParams.set('_page', String(params.page));
  searchParams.set('_limit', String(params.pageSize));

  if (params.search.trim()) {
    searchParams.set('name_like', params.search.trim());
  }

  for (const status of params.status) {
    searchParams.append('status', status);
  }

  if (params.sort) {
    searchParams.set('_sort', params.sort);
    searchParams.set('_order', params.order ?? 'asc');
  }

  const { data, headers } = await client.get<Person[]>(
    `/people?${searchParams.toString()}`,
    {
      signal,
    }
  );

  const total = Number(headers['x-total-count'] ?? data.length);

  return { people: data, total };
};

/** Deletes a person by id. */
export const deletePerson = async (id: number): Promise<void> => {
  await client.delete(`/people/${id}`);
};
