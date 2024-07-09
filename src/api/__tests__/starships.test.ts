import { describe, it, vi, beforeEach, expect } from 'vitest';
import { LazyDataSourceApiRequest } from '@epam/uui-core';
import { IStarship, StarshipsRequest } from '../../types';
import { queryClient } from '../../services';
import { lazyStarshipsApi } from '../starships';
import { STARSHIPS_KEY, STARSHIPS_PAGE_KEY } from '../../constants';
import { mockStarship } from "../../constants/mockData";

vi.mock('../services', () => {
    return {
        queryClient: {
            fetchQuery: vi.fn(),
        },
    };
});

vi.mock('../api', () => ({
    fetchFromSwapi: vi.fn(),
    fetchData: vi.fn(),
}));

vi.mock('../utils', () => ({
    getQuery: vi.fn(() => 'page=1'),
}));

const mockIStarship: IStarship = mockStarship;

const mockStarshipsRequest: StarshipsRequest = {
    count: 3,
    results: [mockIStarship, mockIStarship, mockIStarship],
    next: null,
    previous: null
};

describe('lazyStarshipsApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches starships by ids', async () => {
        vi.spyOn(queryClient, 'fetchQuery').mockResolvedValueOnce(mockIStarship);

        const ids = ['1'];
        const rq: LazyDataSourceApiRequest<IStarship, string, unknown> = { ids, range: null };

        const data = await lazyStarshipsApi(rq);

        expect(data.items).toHaveLength(1);
        expect(queryClient.fetchQuery).toHaveBeenCalledTimes(1);
        expect(queryClient.fetchQuery).toHaveBeenCalledWith({
            queryKey: [STARSHIPS_KEY, '1'],
            queryFn: expect.any(Function),
        });
    });

    it('fetches starships by range', async () => {
        vi.spyOn(queryClient, 'fetchQuery').mockResolvedValueOnce(mockStarshipsRequest);

        const range = { from: 0, count: 3 };
        const rq: LazyDataSourceApiRequest<IStarship, string, unknown> = { ids: null, range };

        const data: { items: IStarship[], count?: number } = await lazyStarshipsApi(rq);

        expect(data.items).toHaveLength(3);
        expect(data.count).toBe(3);
        expect(queryClient.fetchQuery).toHaveBeenCalledTimes(1);
        expect(queryClient.fetchQuery).toHaveBeenCalledWith({
            queryKey: [STARSHIPS_PAGE_KEY, 1],
            queryFn: expect.any(Function),
        });
    });

    it('fetches paginated starships when range.count is greater than initial data length', async () => {
        const fetchQuerySpy = vi
            .spyOn(queryClient, 'fetchQuery')
            .mockResolvedValueOnce({
                count: 6,
                results: [mockIStarship, mockIStarship, mockIStarship],
            })
            .mockResolvedValueOnce({
                count: 6,
                results: [mockIStarship, mockIStarship, mockIStarship],
            });

        const range = { from: 0, count: 6 };
        const rq: LazyDataSourceApiRequest<IStarship, string, unknown> = { ids: null, range };

        const data: { items: IStarship[], count?: number } = await lazyStarshipsApi(rq);

        expect(data.items).toHaveLength(6);
        expect(data.count).toBe(6);
        expect(queryClient.fetchQuery).toHaveBeenCalledTimes(2);
        expect(queryClient.fetchQuery).toHaveBeenNthCalledWith(1, {
            queryKey: [STARSHIPS_PAGE_KEY, 1],
            queryFn: expect.any(Function),
        });
        expect(queryClient.fetchQuery).toHaveBeenNthCalledWith(2, {
            queryKey: [STARSHIPS_PAGE_KEY, 2],
            queryFn: expect.any(Function),
        });
    });
});
