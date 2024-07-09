import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { waitFor, renderHook } from '@testing-library/react';
import { usePersonsWithPaging } from '../usePersonsWithPaging';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { pagingData } from '../../../constants/mockData';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});
const wrapper: React.FC = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mock = new MockAdapter(axios);

describe('usePersonsWithPaging', () => {
    it('should get the data from the request, then from the cache', async () => {
        mock.onGet('https://swapi.dev/api/people/?page=1').replyOnce(200, {
            data: pagingData.firstPage,
        });
        const { result } = renderHook(() => usePersonsWithPaging(1), {
            wrapper,
        });

        await waitFor(() => result.current.status);
        await waitFor(() =>
            expect(result.current.data).toEqual({ data: pagingData.firstPage }),
        );

        const { result: resultUpdate } = renderHook(
            () => usePersonsWithPaging(1),
            { wrapper },
        );

        await waitFor(() => resultUpdate.current.status);
        await waitFor(() =>
            expect(resultUpdate.current.data).toEqual({
                data: pagingData.firstPage,
            }),
        );
    });

    it('should search for data from the request, then from the cache', async () => {
        mock.onGet('https://swapi.dev/api/people/?page=1&search=luk').replyOnce(
            200,
            { data: pagingData.searchLuk },
        );
        const { result } = renderHook(() => usePersonsWithPaging(1, 'luk'), {
            wrapper,
        });

        await waitFor(() => result.current.status);
        await waitFor(() =>
            expect(result.current.data).toEqual({ data: pagingData.searchLuk }),
        );

        const { result: resultUpdate } = renderHook(
            () => usePersonsWithPaging(1, 'luk'),
            { wrapper },
        );

        await waitFor(() => resultUpdate.current.status);
        await waitFor(() =>
            expect(resultUpdate.current.data).toEqual({
                data: pagingData.searchLuk,
            }),
        );
    });
});
