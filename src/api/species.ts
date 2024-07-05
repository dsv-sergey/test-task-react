import axios from "axios";
import { ORIGIN } from "../constants";
import { SPECIES_KEY, SPECIES_PAGE_KEY } from "../constants";
import { LazyDataSourceApiRequest } from "@epam/uui-core";
import { IPersonsRequest, ISpecies } from "../types";
import { queryClient } from "../services";
import { fetchData } from "./data";

export const fetchSpecies = async (page: number) => {
    const { data } = await axios({
        method: "GET",
        url: `${ORIGIN}/species/?page=${page}`
    });

    return data;
};

export const lazySpeciesApi = async (rq: LazyDataSourceApiRequest<ISpecies, string, unknown>) => {
    const { ids, range } = rq;

    let page = (range?.from && Math.floor(range?.from / 10) + 1) || 1;

    if (ids && ids?.length > 0) {
        const requests = ids.map(async (path) => {
            return await queryClient.fetchQuery({
                queryKey: [SPECIES_KEY, path],
                queryFn: () => fetchData(path)});
        });

        const speciesArr = await Promise.all(requests);

        return Promise.resolve({ items: [...speciesArr] });
    }

    const items = [];

    const data: IPersonsRequest = await queryClient.fetchQuery({
        queryKey: [SPECIES_PAGE_KEY, page],
        queryFn: () => fetchSpecies(page)});
    items.push(...data.results);

    while (range?.count && (range.count > items.length) && items.length < data.count) {
        page = page + 1;
        const data: IPersonsRequest = await queryClient.fetchQuery({
            queryKey: [SPECIES_PAGE_KEY, page],
            queryFn: () => fetchSpecies(page)});
        items.push(...data.results);
    }

    return Promise.resolve({ items: items, count: data.count });
};
