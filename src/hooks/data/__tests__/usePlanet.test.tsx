import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { waitFor, renderHook } from '@testing-library/react';
import { usePlanet } from '../usePlanet';
import { planetMock } from '../../../constants/mockData';
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

describe('usePlanet', () => {
    it('should get the data from the request, then from the cache', async () => {
        mock.onGet('https://swapi.dev/api/planets/21/').replyOnce(200, {
            data: planetMock,
        });
        const { result } = renderHook(
            () => usePlanet('https://swapi.dev/api/planets/21/'),
            { wrapper },
        );

        await waitFor(() => result.current.status);
        await waitFor(() =>
            expect(result.current.data).toEqual({ data: planetMock }),
        );

        const { result: resultUpdate } = renderHook(
            () => usePlanet('https://swapi.dev/api/planets/21/'),
            { wrapper },
        );

        await waitFor(() => resultUpdate.current.status);
        await waitFor(() =>
            expect(resultUpdate.current.data).toEqual({ data: planetMock }),
        );
    });
});
