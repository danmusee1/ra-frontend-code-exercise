import { ReactElement, useEffect, useState } from 'react';
import { Person } from 'types/person';

const getPeople = async (search: string, page: number): Promise<Person[]> => {
  let queryParams = `?_page=${page}`;

  if (search) {
    queryParams += `&name_like=${search}`;
  }

  const url = `http://localhost:4002/people${queryParams}`;
  const response = await fetch(url, { method: 'GET' });

  const people = await response.json();

  return people;
};

const capitalizeFirst = (text: string | undefined): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

type Props = {
  search: string;
};

export const PeopleTable = (props: Props): ReactElement => {
  const { search } = props;
  const [people, setPeople] = useState<Person[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadPeople = async (): Promise<void> => {
      setIsLoading(true);
      const data = await getPeople(search, currentPage);
      setPeople(data);
      setIsLoading(false);
    };

    loadPeople();
  }, [search, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <table className="table-fixed w-full border-collapse">
        <thead>
          <tr className="bg-[var(--colors-gray-300)] text-[var(--colors-darkBlue)] font-semibold">
            <th className="whitespace-nowrap px-4 py-3 text-[1.2rem] text-left">Name</th>
            <th className="px-4 py-3 text-[1.2rem] text-left">Role</th>
            <th className="px-4 py-3 text-[1.2rem] text-left">Type</th>
            <th className="px-4 py-3 text-[1.2rem] text-left">Status</th>
            <th className="px-4 py-3 text-[1.2rem] text-left">Country</th>
            <th className="px-4 py-3 text-[1.2rem] text-left">Salary</th>
          </tr>
        </thead>

        {isLoading && (
          <tbody className="relative bg-[var(--colors-blank)]">
            <tr>
              <td className="h-[200px] text-center" colSpan={6}>
                <span className="text-[1.6rem] font-medium">Loading...</span>
              </td>
            </tr>
          </tbody>
        )}

        {!isLoading && (
          <tbody>
            {people?.map((person) => (
              <tr key={person.name} className="transition-colors hover:bg-[var(--colors-gray-100)]">
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">{person.name}</td>
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">{person.jobTitle}</td>
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">{capitalizeFirst(person.employment)}</td>
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">{capitalizeFirst(person.status)}</td>
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">{person.country}</td>
                <td className="px-4 py-3 border-t border-[var(--colors-gray-300)] bg-[var(--colors-blank)]">{person.salary}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>

      {!isLoading && (
        <div className="flex justify-center mt-4">
          <button
            className="px-3 py-2 mx-1 rounded border bg-white"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="px-3 py-2 mx-1">Page {currentPage}</span>
          <button className="px-3 py-2 mx-1 rounded border bg-white" onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </button>
        </div>
      )}
    </>
  );
};
