import {
    PAGINATION,
    STARSHIPS_KEY,
    STARSHIPS_PAGE_KEY,
    SWAPI_ROUTES,
} from '../constants';
import { LazyDataSourceApiRequest } from '@epam/uui-core';
import { IStarship, StarshipsRequest } from '../types';
import { queryClient } from '../services';
import { fetchData, fetchFromSwapi } from '../api';
import { getQuery } from '../utils';

const fetchSpeciesByIds = async (ids: string[]) => {
    const requests = ids.map(async (path) => {
        if (typeof path !== 'string') return;
        return await queryClient.fetchQuery<IStarship>({
            queryKey: [STARSHIPS_KEY, path],
            queryFn: () => fetchData(path),
        });
    });

    const starshipsArr = await Promise.all(requests);
    return Promise.resolve({ items: [...starshipsArr] });
};

const fetchSpeciesByRange = async (range: { from?: number; count?: number }) => {
    let page = (range?.from && Math.floor(range?.from / PAGINATION.ITEMS_PER_PAGE) + 1) || 1;

    const items: IStarship[] = [];

    const fetchStarships = async (page: number) => {
        const query = getQuery({ page });
        return await fetchFromSwapi(`${SWAPI_ROUTES.STARSHIPS}?${query}`);
    };

    const fetchPage = async (pageNumber: number): Promise<StarshipsRequest> => {
        return await queryClient.fetchQuery({
            queryKey: [STARSHIPS_PAGE_KEY, pageNumber],
            queryFn: () => fetchStarships(pageNumber),
        });
    };

    const initialData = await fetchPage(page);

    items.push(...initialData.results);

    while (range?.count && range.count > items.length && items.length < initialData.count) {
        page += 1;
        const data = await fetchPage(page);
        items.push(...data.results);
    }

    return Promise.resolve({ items: items, count: items.length });
};

export const lazyStarshipsApi = async (rq: LazyDataSourceApiRequest<IStarship, string, unknown>) => {
    const { ids, range } = rq;

    if (ids && ids?.length > 0) {
        return fetchSpeciesByIds(ids);
    }

    return fetchSpeciesByRange(range);
};
