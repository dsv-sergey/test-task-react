import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { waitFor, renderHook } from '@testing-library/react';
import { usePerson } from '../usePerson';
import { personData } from '../../../constants/mockData';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

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

describe('usePerson', () => {
    it('should get the data from the request, then from the cache', async () => {
        mock.onGet('https://swapi.dev/api/people/1').replyOnce(200, {
            data: personData,
        });
        const { result } = renderHook(() => usePerson('1'), { wrapper });

        await waitFor(() => result.current.status);
        await waitFor(() => {
            expect(result.current.data).toEqual({ data: personData });
        });

        const { result: resultUpdate } = renderHook(() => usePerson('1'), {
            wrapper,
        });

        await waitFor(() => resultUpdate.current.status);
        await waitFor(() =>
            expect(resultUpdate.current.data).toEqual({ data: personData }),
        );
    });
});
