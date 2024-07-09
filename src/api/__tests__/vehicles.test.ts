import { describe, it, vi, beforeEach, expect } from 'vitest';
import { LazyDataSourceApiRequest } from '@epam/uui-core';
import { IVehicle, VehiclesRequest } from '../../types';
import { queryClient } from '../../services';
import { lazyVehiclesApi } from '../vehicles';
import { VEHICLES_KEY, VEHICLES_PAGE_KEY } from '../../constants';
import { mockVehicle } from "../../constants/mockData";

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

const mockIVehicle: IVehicle = mockVehicle;

const mockStarshipsRequest: VehiclesRequest = {
    count: 3,
    results: [mockIVehicle, mockIVehicle, mockIVehicle],
    next: null,
    previous: null
};

describe('lazyVehiclesApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches vehicles by ids', async () => {
        vi.spyOn(queryClient, 'fetchQuery').mockResolvedValueOnce(mockIVehicle);

        const ids = ['1'];
        const rq: LazyDataSourceApiRequest<IVehicle, string, unknown> = { ids, range: null };

        const data = await lazyVehiclesApi(rq);

        expect(data.items).toHaveLength(1);
        expect(queryClient.fetchQuery).toHaveBeenCalledTimes(1);
        expect(queryClient.fetchQuery).toHaveBeenCalledWith({
            queryKey: [VEHICLES_KEY, '1'],
            queryFn: expect.any(Function),
        });
    });

    it('fetches vehicles by range', async () => {
        vi.spyOn(queryClient, 'fetchQuery').mockResolvedValueOnce(mockStarshipsRequest);

        const range = { from: 0, count: 3 };
        const rq: LazyDataSourceApiRequest<IVehicle, string, unknown> = { ids: null, range };

        const data: { items: IVehicle[], count?: number } = await lazyVehiclesApi(rq);

        expect(data.items).toHaveLength(3);
        expect(data.count).toBe(3);
        expect(queryClient.fetchQuery).toHaveBeenCalledTimes(1);
        expect(queryClient.fetchQuery).toHaveBeenCalledWith({
            queryKey: [VEHICLES_PAGE_KEY, 1],
            queryFn: expect.any(Function),
        });
    });

    it('fetches paginated vehicles when range.count is greater than initial data length', async () => {
        const fetchQuerySpy = vi
            .spyOn(queryClient, 'fetchQuery')
            .mockResolvedValueOnce({
                count: 6,
                results: [mockIVehicle, mockIVehicle, mockIVehicle],
            })
            .mockResolvedValueOnce({
                count: 6,
                results: [mockIVehicle, mockIVehicle, mockIVehicle],
            });

        const range = { from: 0, count: 6 };
        const rq: LazyDataSourceApiRequest<IVehicle, string, unknown> = { ids: null, range };

        const data: { items: IVehicle[], count?: number } = await lazyVehiclesApi(rq);

        expect(data.items).toHaveLength(6);
        expect(data.count).toBe(6);
        expect(queryClient.fetchQuery).toHaveBeenCalledTimes(2);
        expect(queryClient.fetchQuery).toHaveBeenNthCalledWith(1, {
            queryKey: [VEHICLES_PAGE_KEY, 1],
            queryFn: expect.any(Function),
        });
        expect(queryClient.fetchQuery).toHaveBeenNthCalledWith(2, {
            queryKey: [VEHICLES_PAGE_KEY, 2],
            queryFn: expect.any(Function),
        });
    });
});
