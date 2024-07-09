import { describe, it, vi, beforeEach, expect } from 'vitest';
import { LazyDataSourceApiRequest } from '@epam/uui-core';
import { IPlanet, PlanetsRequest } from '../../types';
import { queryClient } from '../../services';
import { lazyPlanetsApi } from '../planets';
import { planetMock } from "../../constants/mockData";
import { PLANETS_KEY, PLANETS_PAGE_KEY } from "../../constants";

vi.mock('../services', () => {
    return {
        queryClient: {
            fetchQuery: vi.fn(),
        },
    };
});

vi.mock('../api', () => ({
    fetchFromSwapi: vi.fn(),
}));

vi.mock('../utils', () => ({
    getQuery: vi.fn(() => 'page=1'),
}));

const mockIPlanet: IPlanet = planetMock;

const mockPlanetsRequest: PlanetsRequest = {
    count: 3,
    results: [mockIPlanet, mockIPlanet, mockIPlanet],
    next: null,
    previous: null
};

describe('lazyPlanetsApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches planets by ids', async () => {
        vi.spyOn(queryClient, 'fetchQuery').mockResolvedValueOnce(mockIPlanet);

        const ids = ['1'];
        const rq: LazyDataSourceApiRequest<IPlanet, string, unknown> = { ids, range: null };

        const data = await lazyPlanetsApi(rq);

        expect(data.items).toHaveLength(1);
        expect(queryClient.fetchQuery).toHaveBeenCalledTimes(1);
        expect(queryClient.fetchQuery).toHaveBeenCalledWith({ queryKey: [PLANETS_KEY, '1'], queryFn: expect.any(Function) });
    });

    it('fetches planets by range', async () => {
        vi.spyOn(queryClient, 'fetchQuery').mockResolvedValueOnce(mockPlanetsRequest);

        const range = { from: 0, count: 3 };
        const rq: LazyDataSourceApiRequest<IPlanet, string, unknown> = { ids: null, range };

        const data: { items: IPlanet[], count?: number } = await lazyPlanetsApi(rq);

        expect(data.items).toHaveLength(3);
        expect(data.count).toBe(3);
        expect(queryClient.fetchQuery).toHaveBeenCalledTimes(1);
        expect(queryClient.fetchQuery).toHaveBeenCalledWith({ queryKey: [PLANETS_PAGE_KEY, 1], queryFn: expect.any(Function) });
    });

    it('fetches paginated planets when range.count is greater than initial data length', async () => {
        const fetchQuerySpy = vi
            .spyOn(queryClient, 'fetchQuery')
            .mockResolvedValueOnce({
                count: 6,
                results: [mockIPlanet, mockIPlanet, mockIPlanet],
            })
            .mockResolvedValueOnce({
                count: 6,
                results: [mockIPlanet, mockIPlanet, mockIPlanet],
            });

        const range = { from: 0, count: 6 };
        const rq: LazyDataSourceApiRequest<IPlanet, string, unknown> = { ids: null, range };

        const data = await lazyPlanetsApi(rq);

        expect(data.items).toHaveLength(6);
        expect(data.count).toBe(6);
        expect(queryClient.fetchQuery).toHaveBeenCalledTimes(2);
        expect(queryClient.fetchQuery).toHaveBeenNthCalledWith(1, { queryKey: [PLANETS_PAGE_KEY, 1], queryFn: expect.any(Function) });
        expect(queryClient.fetchQuery).toHaveBeenNthCalledWith(2, { queryKey: [PLANETS_PAGE_KEY, 2], queryFn: expect.any(Function) });
    });
});
