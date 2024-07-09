import {
    PAGINATION,
    SWAPI_ROUTES,
    VEHICLES_KEY,
    VEHICLES_PAGE_KEY,
} from '../constants';
import { LazyDataSourceApiRequest } from '@epam/uui-core';
import { VehiclesRequest, IVehicle } from '../types';
import { queryClient } from '../services';
import { fetchData } from './fetchData';
import { fetchFromSwapi } from './fetchFromSwapi';
import { getQuery } from '../utils';

const fetchVehiclesByIds = async (ids: string[]) => {
    const requests = ids.map(async (path) => {
        if (typeof path !== 'string') return;
        return await queryClient.fetchQuery<IVehicle>({
            queryKey: [VEHICLES_KEY, path],
            queryFn: () => fetchData(path),
        });
    });

    const vehiclesArr = await Promise.all(requests);

    return Promise.resolve({ items: [...vehiclesArr] });
};

const fetchVehiclesByRange = async (range: { from?: number; count?: number }) => {
    let page = (range?.from && Math.floor(range?.from / PAGINATION.ITEMS_PER_PAGE) + 1) || 1;

    const items: IVehicle[] = [];

    const fetchVehicles = async (page: number) => {
        const query = getQuery({ page });
        return await fetchFromSwapi(`${SWAPI_ROUTES.VEHICLES}?${query}`);
    };

    const fetchPage = async (pageNumber: number): Promise<VehiclesRequest> => {
        return await queryClient.fetchQuery({
            queryKey: [VEHICLES_PAGE_KEY, pageNumber],
            queryFn: () => fetchVehicles(pageNumber),
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

export const lazyVehiclesApi = async (rq: LazyDataSourceApiRequest<IVehicle, string>) => {
    const { ids, range } = rq;

    if (ids && ids?.length > 0) {
        return fetchVehiclesByIds(ids);
    }

    return fetchVehiclesByRange(range);
};
