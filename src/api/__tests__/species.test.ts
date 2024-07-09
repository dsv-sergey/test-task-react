import { describe, it, vi, beforeEach, expect } from 'vitest';
import { LazyDataSourceApiRequest } from '@epam/uui-core';
import { ISpecie, SpeciesRequest } from '../../types';
import { queryClient } from '../../services';
import { lazySpeciesApi } from '../species';
import { SPECIES_KEY, SPECIES_PAGE_KEY } from '../../constants';
import { mockSpecies } from "../../constants/mockData";

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

const mockISpecie: ISpecie = mockSpecies;

const mockSpeciesRequest: SpeciesRequest = {
    count: 3,
    results: [mockISpecie, mockISpecie, mockISpecie],
    next: null,
    previous: null
};

describe('lazySpeciesApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches species by ids', async () => {
        vi.spyOn(queryClient, 'fetchQuery').mockResolvedValueOnce(mockISpecie);

        const ids = ['1'];
        const rq: LazyDataSourceApiRequest<ISpecie, string, unknown> = { ids, range: null };

        const data = await lazySpeciesApi(rq);

        expect(data.items).toHaveLength(1);
        expect(queryClient.fetchQuery).toHaveBeenCalledTimes(1);
        expect(queryClient.fetchQuery).toHaveBeenCalledWith({
            queryKey: [SPECIES_KEY, '1'],
            queryFn: expect.any(Function),
        });
    });

    it('fetches species by range', async () => {
        vi.spyOn(queryClient, 'fetchQuery').mockResolvedValueOnce(mockSpeciesRequest);

        const range = { from: 0, count: 3 };
        const rq: LazyDataSourceApiRequest<ISpecie, string, unknown> = { ids: null, range };

        const data: { items: ISpecie[], count?: number } = await lazySpeciesApi(rq);
        console.log(data);
        expect(data.items).toHaveLength(3);
        expect(data.count).toBe(3);
        expect(queryClient.fetchQuery).toHaveBeenCalledTimes(1);
        expect(queryClient.fetchQuery).toHaveBeenCalledWith({
            queryKey: [SPECIES_PAGE_KEY, 1],
            queryFn: expect.any(Function),
        });
    });

    it('fetches paginated species when range.count is greater than initial data length', async () => {
        const fetchQuerySpy = vi
            .spyOn(queryClient, 'fetchQuery')
            .mockResolvedValueOnce({
                count: 6,
                results: [mockISpecie, mockISpecie, mockISpecie],
            })
            .mockResolvedValueOnce({
                count: 6,
                results: [mockISpecie, mockISpecie, mockISpecie],
            });

        const range = { from: 0, count: 6 };
        const rq: LazyDataSourceApiRequest<ISpecie, string, unknown> = { ids: null, range };

        const data: { items: ISpecie[], count?: number } = await lazySpeciesApi(rq);

        expect(data.items).toHaveLength(6);
        expect(data.count).toBe(6);
        expect(queryClient.fetchQuery).toHaveBeenCalledTimes(2);
        expect(queryClient.fetchQuery).toHaveBeenNthCalledWith(1, {
            queryKey: [SPECIES_PAGE_KEY, 1],
            queryFn: expect.any(Function),
        });
        expect(queryClient.fetchQuery).toHaveBeenNthCalledWith(2, {
            queryKey: [SPECIES_PAGE_KEY, 2],
            queryFn: expect.any(Function),
        });
    });
});
