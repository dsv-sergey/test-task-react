import { useQuery } from "@tanstack/react-query";
import { fetchPersons } from "../../api";
import { IPersonsRequest, TError } from "../../types";
import { queryClient } from "../../services";

const KEY = "PERSONS_PAGE";

export const usePersonsWithPaging = (page: number, search?: string) => {

    const createQueryKey = (page: number, search?: string) => {
        return search ? [KEY, search, page] : [KEY, page];
    };

    const initialData = queryClient.getQueryData<Partial<IPersonsRequest>>(createQueryKey(page, search));

    const query = useQuery<Partial<IPersonsRequest>, TError>({
        queryKey: createQueryKey(page, search),
        queryFn: () => fetchPersons(page, search),
        networkMode: "offlineFirst",
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnReconnect: false,
        gcTime: 1000 * 60 * 60 * 24,
        initialData: initialData,
    });

    const totalPages =  query.data ? Math.ceil((query.data as unknown as IPersonsRequest).count / 10) : 0;

    return {
        ...query,
        totalPages,
    };
};
