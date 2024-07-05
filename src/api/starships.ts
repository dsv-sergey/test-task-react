import axios from "axios";
import { ORIGIN } from "../constants";
import { STARSHIPS_KEY, STARSHIPS_PAGE_KEY } from "../constants";
import { LazyDataSourceApiRequest } from "@epam/uui-core";
import { IPersonsRequest, IStarships } from "../types";
import { queryClient } from "../services";
import { fetchData } from "./data";

export const fetchStarships = async (page: number) => {
    const { data } = await axios({
        method: "GET",
        url: `${ORIGIN}/starships/?page=${page}`
    });

    return data;
};

export const lazyStarshipsApi = async (rq: LazyDataSourceApiRequest<IStarships, string, unknown>) => {
    const { ids, range } = rq;

    let page = (range?.from && Math.floor(range?.from / 10) + 1) || 1;

    if (ids && ids?.length > 0) {
        const requests = ids.map(async (path) => {
            return await queryClient.fetchQuery({
                queryKey: [STARSHIPS_KEY, path],
                queryFn: () => fetchData(path),
            });
        });

        const starshipsArr = await Promise.all(requests);

        return Promise.resolve({ items: [...starshipsArr] });
    }

    const items = [];

    const data: IPersonsRequest = await queryClient.fetchQuery({
        queryKey: [STARSHIPS_PAGE_KEY, page],
        queryFn: () => fetchStarships(page),
    });

    items.push(...data.results);

    while (range?.count && (range.count > items.length) && items.length < data.count) {
        page = page + 1;
        const data: IPersonsRequest = await queryClient.fetchQuery({
            queryKey: [STARSHIPS_PAGE_KEY, page],
            queryFn: () => fetchStarships(page),
        });
        items.push(...data.results);
    }

    return Promise.resolve({ items: items, count: data.count });
};
