import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: Infinity,
            networkMode: "offlineFirst",
            refetchOnWindowFocus: false,
            staleTime: Infinity,
            refetchOnMount: false,
            refetchOnReconnect: false,
        }
    }
});

const localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
});

persistQueryClient({
    queryClient,
    persister: localStoragePersister,
    maxAge: Infinity,
});

export const createQueryClient = () => {
    return queryClient;
};