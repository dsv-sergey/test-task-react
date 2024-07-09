import { LazyDataSourceApiRequest } from '@epam/uui-core';
import {
    FILMS_KEY,
    FILMS_PAGE_KEY,
    PAGINATION,
    SWAPI_ROUTES,
} from '../constants';
import { IFilm, FilmsRequest } from '../types';
import { queryClient } from '../services';
import { fetchFromSwapi, fetchData } from '../api';
import { getQuery } from '../utils';

const fetchFilmsByIds = async (ids: string[]) => {
    const requests = ids.map(async (path) => {
        if (typeof path !== 'string') return;
        return await queryClient.fetchQuery<IFilm>({
            queryKey: [FILMS_KEY, path],
            queryFn: () => fetchData(path),
        });
    });

    const filmsArr = await Promise.all(requests);

    return Promise.resolve({ items: [...filmsArr] });
};

const fetchFilmsByRange = async (range: { from?: number; count?: number }) => {
    let page = (range?.from && Math.floor(range?.from / PAGINATION.ITEMS_PER_PAGE) + 1) || 1;

    const items: IFilm[] = [];

    const fetchFilms = async (page: number) => {
        const query = getQuery({ page });
        return await fetchFromSwapi(`${SWAPI_ROUTES.FILMS}?${query}`);
    };

    const fetchPage = async (pageNumber: number): Promise<FilmsRequest> => {
        return await queryClient.fetchQuery({
            queryKey: [FILMS_PAGE_KEY, pageNumber],
            queryFn: () => fetchFilms(pageNumber),
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

export const lazyFilmsApi = async (rq: LazyDataSourceApiRequest<IFilm, string, unknown>) => {
    const { ids, range } = rq;

    if (ids && ids.length > 0) {
        return fetchFilmsByIds(ids);
    }

    return fetchFilmsByRange(range);
};
