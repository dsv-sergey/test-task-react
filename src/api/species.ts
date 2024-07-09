import {
    PAGINATION,
    SPECIES_KEY,
    SPECIES_PAGE_KEY,
    SWAPI_ROUTES,
} from '../constants';
import { LazyDataSourceApiRequest } from '@epam/uui-core';
import { ISpecie, SpeciesRequest } from '../types';
import { queryClient } from '../services';
import { fetchFromSwapi, fetchData } from '../api';
import { getQuery } from '../utils';

const fetchSpeciesByIds = async (ids: string[]) => {
    const requests = ids.map(async (path) => {
        if (typeof path !== 'string') return;
        return await queryClient.fetchQuery<ISpecie>({
            queryKey: [SPECIES_KEY, path],
            queryFn: () => fetchData(path),
        });
    });

    const speciesArr = await Promise.all(requests);
    return Promise.resolve({ items: [...speciesArr] });
};

const fetchSpeciesByRange = async (range: { from?: number; count?: number }) => {
    let page = (range?.from && Math.floor(range?.from / PAGINATION.ITEMS_PER_PAGE) + 1) || 1;

    const items: ISpecie[] = [];

    const fetchSpecies = async (page: number) => {
        const query = getQuery({ page });
        return await fetchFromSwapi(`${SWAPI_ROUTES.SPECIES}?${query}`);
    };

    const fetchPage = async (pageNumber: number): Promise<SpeciesRequest> => {
        return await queryClient.fetchQuery({
            queryKey: [SPECIES_PAGE_KEY, pageNumber],
            queryFn: () => fetchSpecies(pageNumber),
        });
    };

    const initialData = await fetchPage(page);

    console.log(initialData)

    items.push(...initialData.results);

    while (range?.count && range.count > items.length && items.length < initialData.count) {
        page += 1;
        const data = await fetchPage(page);
        items.push(...data.results);
    }

    return Promise.resolve({ items, count: initialData.count });
};

export const lazySpeciesApi = async (rq: LazyDataSourceApiRequest<ISpecie, string, unknown>) => {
    const { ids, range } = rq;

    if (ids && ids.length > 0) {
        return fetchSpeciesByIds(ids);
    }

    return fetchSpeciesByRange(range);
};
