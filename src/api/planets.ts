import axios from "axios";
import { LazyDataSourceApiRequest } from "@epam/uui-core";
import { ORIGIN } from "../constants";
import { PLANETS_KEY, PLANETS_PAGE_KEY } from "../constants";
import { IPersonsRequest, IPlanet } from "../types";
import { queryClient } from "../services";
import { fetchData } from "./data";

export const fetchPlanets = async (page: number) => {
    const { data } = await axios({
        method: "GET",
        url: `${ORIGIN}/planets/?page=${page}`
    });

    return data;
};



export const lazyPlanetsApi = async (rq: LazyDataSourceApiRequest<IPlanet, string, unknown>) => {
    const { ids, range } = rq;

    let page = (range?.from && Math.floor(range?.from / 10) + 1) || 1;

    if (ids && ids?.length > 0) {
        const data = await queryClient.fetchQuery({
            queryKey: [PLANETS_KEY, ids?.[0]],
            queryFn:() => fetchData(ids?.[0])});

        return Promise.resolve({ items: [data] });
    }

    const items = [];

    const data: IPersonsRequest = await queryClient.fetchQuery({
        queryKey: [PLANETS_PAGE_KEY, page],
        queryFn:() => fetchPlanets(page)});
    items.push(...data.results);

    while (range?.count && (range.count > items.length) && items.length < data.count) {
        page = page + 1;
        const data: IPersonsRequest = await queryClient.fetchQuery({
            queryKey: [PLANETS_PAGE_KEY, page],
            queryFn:() => fetchPlanets(page)});
        items.push(...data.results);
    }

    return Promise.resolve({ items: items, count: data.count });
};
