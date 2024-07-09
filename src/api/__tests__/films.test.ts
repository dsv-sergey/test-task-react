import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LazyDataSourceApiRequest } from '@epam/uui-core';
import { IFilm, FilmsRequest } from '../../types';
import { queryClient } from '../../services';
import { lazyFilmsApi } from '../films';
import { filmMock } from "../../constants/mockData";
import {FILMS_KEY, FILMS_PAGE_KEY} from "../../constants";

vi.mock('../services', () => ({
    queryClient: {
        fetchQuery: vi.fn(),
    },
}));

vi.mock('../api', () => ({
    fetchFromSwapi: vi.fn(),
    fetchData: vi.fn(),
}));

vi.mock('../utils', () => ({
    getQuery: vi.fn(() => 'page=1'),
}));

const mockIFilm: IFilm = filmMock;

const mockFilmsRequest: FilmsRequest = {
    count: 3,
    results: [mockIFilm, mockIFilm, mockIFilm],
    next: null,
    previous: null
};

describe('lazyFilmsApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches films by ids', async () => {
        vi.spyOn(queryClient, 'fetchQuery').mockResolvedValueOnce(mockIFilm);

        const ids = ['1'];
        const rq: LazyDataSourceApiRequest<IFilm, string, unknown> = { ids, range: null };

        const data = await lazyFilmsApi(rq);

        expect(data.items).toHaveLength(1);
        expect(queryClient.fetchQuery).toHaveBeenCalledTimes(1);
        expect(queryClient.fetchQuery).toHaveBeenNthCalledWith(1, { queryKey: [FILMS_KEY, '1'], queryFn: expect.any(Function) });
    });

    it('fetches films by range', async () => {
        vi.spyOn(queryClient, 'fetchQuery').mockResolvedValueOnce(mockFilmsRequest);

        const range = { from: 0, count: 3 };
        const rq: LazyDataSourceApiRequest<IFilm, string, unknown> = { ids: null, range };

        const data: { items: IFilm[], count?: number } = await lazyFilmsApi(rq);

        expect(data.items).toHaveLength(3);
        expect(data.count).toBe(3);
        expect(queryClient.fetchQuery).toHaveBeenCalledTimes(1);
        expect(queryClient.fetchQuery).toHaveBeenCalledWith({ queryKey: [FILMS_PAGE_KEY, 1], queryFn: expect.any(Function) });
    });

    it('fetches paginated films when range.count is greater than initial data length', async () => {
        const fetchQuerySpy = vi
            .spyOn(queryClient, 'fetchQuery')
            .mockResolvedValueOnce({
                count: 6,
                results: [mockIFilm, mockIFilm, mockIFilm],
            })
            .mockResolvedValueOnce({
                count: 6,
                results: [mockIFilm, mockIFilm, mockIFilm],
            });

        const range = { from: 0, count: 6 };
        const rq: LazyDataSourceApiRequest<IFilm, string, unknown> = { ids: null, range };

        const data: { items: IFilm[], count?: number } = await lazyFilmsApi(rq);

        expect(data.items).toHaveLength(6);
        expect(data.count).toBe(6);
        expect(queryClient.fetchQuery).toHaveBeenCalledTimes(2);
        expect(queryClient.fetchQuery).toHaveBeenNthCalledWith(1, { queryKey: [FILMS_PAGE_KEY, 1], queryFn: expect.any(Function) });
        expect(queryClient.fetchQuery).toHaveBeenNthCalledWith(2, { queryKey: [FILMS_PAGE_KEY, 2], queryFn: expect.any(Function) });
    });
});
