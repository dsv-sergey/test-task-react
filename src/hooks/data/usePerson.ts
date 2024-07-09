import { useQuery } from '@tanstack/react-query';
import { fetchFromSwapi } from '../../api';
import { PEOPLE_KEY, SWAPI_ROUTES } from '../../constants';
import { IPerson } from '../../types';

export const usePerson = (personId: string) => {
    return useQuery<IPerson>({
        queryKey: [
            PEOPLE_KEY,
            `${SWAPI_ROUTES.BASE_URL + SWAPI_ROUTES.PEOPLE}${personId}/`,
        ],
        queryFn: () => fetchFromSwapi(`${SWAPI_ROUTES.PEOPLE}${personId}`),
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });
};
