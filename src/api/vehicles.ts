import axios from "axios";
import { ORIGIN } from "../constants";
import { VEHICLES_KEY, VEHICLES_PAGE_KEY } from "../constants";
import { LazyDataSourceApiRequest } from "@epam/uui-core";
import { IPersonsRequest, IVehicles } from "../types";
import { queryClient } from "../services";
import { fetchData } from "./data";


export const fetchVehicles = async (page: number) => {
    const { data } = await axios({
        method: "GET",
        url: `${ORIGIN}/vehicles/?page=${page}`
    });

    return data;
};

export const lazyVehiclesApi = async (rq: LazyDataSourceApiRequest<IVehicles, string, unknown>) => {
    const { ids, range } = rq;

    let page = (range?.from && Math.floor(range?.from / 10) + 1) || 1;

    if (ids && ids?.length > 0) {
        const requests = ids.map(async (path) => {
            return await queryClient.fetchQuery({
                queryKey: [VEHICLES_KEY, path],
                queryFn: () => fetchData(path),
            });
        });

        const vehiclesArr = await Promise.all(requests);

        return Promise.resolve({ items: [...vehiclesArr] });
    }

    const items = [];

    const data: IPersonsRequest = await queryClient.fetchQuery({
        queryKey: [VEHICLES_PAGE_KEY, page],
        queryFn: () => fetchVehicles(page),
    });
    items.push(...data.results);

    while (range?.count && (range.count > items.length) && items.length < data.count) {
        page = page + 1;
        const data: IPersonsRequest = await queryClient.fetchQuery({
            queryKey: [VEHICLES_PAGE_KEY, page],
            queryFn: () => fetchVehicles(page),
        });
        items.push(...data.results);
    }

    return Promise.resolve({ items: items, count: data.count });
};
