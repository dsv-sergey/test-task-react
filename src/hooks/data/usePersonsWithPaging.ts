import { useQuery } from '@tanstack/react-query';
import { fetchPeople } from '../../api';
import { PersonsRequest, TError } from '../../types';
import { queryClient } from '../../services';
import { PAGINATION, PEOPLE_PAGE_KEY } from '../../constants';

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;

export const usePersonsWithPaging = (page: number, search?: string) => {
    const createQueryKey = (page: number, search?: string) => {
        return search
            ? [PEOPLE_PAGE_KEY, search, page]
            : [PEOPLE_PAGE_KEY, page];
    };

    const initialData = queryClient.getQueryData<Partial<PersonsRequest>>(
        createQueryKey(page, search),
    );

    const query = useQuery<Partial<PersonsRequest>, TError>({
        queryKey: createQueryKey(page, search),
        queryFn: () => fetchPeople(page, search),
        networkMode: 'offlineFirst',
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnReconnect: false,
        gcTime: DAYS,
        initialData: initialData,
    });

    const totalPages = query.data
        ? Math.ceil(
              (query.data as unknown as PersonsRequest).count /
                  PAGINATION.ITEMS_PER_PAGE,
          )
        : 0;

    return {
        ...query,
        totalPages,
    };
};
