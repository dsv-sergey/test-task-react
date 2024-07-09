import { LazyDataSourceApiRequest } from '@epam/uui-core';
import {
    PAGINATION,
    PLANETS_KEY,
    PLANETS_PAGE_KEY,
    SWAPI_ROUTES,
} from '../constants';
import { IPlanet, PlanetsRequest } from '../types';
import { queryClient } from '../services';
import { fetchFromSwapi, fetchData } from '../api';
import { getQuery } from '../utils';

const fetchPlanetsByIds = async (ids: string[]) => {
    const data = await queryClient.fetchQuery<IPlanet>({
        queryKey: [PLANETS_KEY, ids?.[0]],
        queryFn: () => fetchData(ids?.[0]),
    });

    return Promise.resolve({ items: [data] });
};

const fetchPlanetsByRange = async (range: { from?: number; count?: number }): Promise<{ items: IPlanet[]; count: number }> => {
    let page = (range?.from && Math.floor(range?.from / PAGINATION.ITEMS_PER_PAGE) + 1) || 1;

    const items: IPlanet[] = [];

    const fetchPlanets = async (page: number) => {
        const query = getQuery({ page });
        return await fetchFromSwapi(`${SWAPI_ROUTES.PLANETS}?${query}`);
    };

    const fetchPage = async (pageNumber: number): Promise<PlanetsRequest> => {
        return await queryClient.fetchQuery({
            queryKey: [PLANETS_PAGE_KEY, pageNumber],
            queryFn: () => fetchPlanets(pageNumber),
        });
    };

    const initialData = await fetchPage(page);
    items.push(...initialData.results);

    while (range?.count && range.count > items.length && items.length < initialData.count) {
        page += 1;
        const data = await fetchPage(page);
        items.push(...data.results);
    }

    return Promise.resolve({ items, count: initialData.count });
};

export const lazyPlanetsApi = async (rq: LazyDataSourceApiRequest<IPlanet, string, unknown>): Promise<{ items: IPlanet[]; count?: number }> => {
    const { ids, range } = rq;

    if (ids && ids.length > 0) {
        return fetchPlanetsByIds(ids);
    }

    return fetchPlanetsByRange(range);
};
