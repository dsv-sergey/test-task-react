import axios from "axios";
import { ORIGIN } from "../constants";
import { FILMS_KEY, FILMS_PAGE_KEY } from "../constants";
import { LazyDataSourceApiRequest } from "@epam/uui-core";
import { IFilm, IPersonsRequest } from "../types";
import { queryClient } from "../services";
import { fetchData } from "./data";

export const fetchFilms = async (page: number) => {
    const { data } = await axios({
        method: "GET",
        url: `${ORIGIN}/films/?page=${page}`
    });

    return data;
};

export const lazyFilmsApi = async (rq: LazyDataSourceApiRequest<IFilm, string, unknown>) => {
    const { ids, range } = rq;

    let page = (range?.from && Math.floor(range?.from / 10) + 1) || 1;

    if (ids && ids?.length > 0) {
        const requests = ids.map(async (path) => {
            return await queryClient.fetchQuery({
                queryKey: [FILMS_KEY, path],
                queryFn: () => fetchData(path),
            });
        });

        const filmsArr = await Promise.all(requests);

        return Promise.resolve({ items: [...filmsArr] });
    }

    const items = [];

    const data: IPersonsRequest = await queryClient.fetchQuery({
        queryKey: [FILMS_PAGE_KEY, page],
        queryFn: () => fetchFilms(page),
    });
    items.push(...data.results);

    while (range?.count && (range.count > items.length) && items.length < data.count) {
        page = page + 1;
        const data: IPersonsRequest = await queryClient.fetchQuery({
            queryKey: [FILMS_PAGE_KEY, page],
            queryFn: () => fetchFilms(page),
        });
        items.push(...data.results);
    }

    return Promise.resolve({ items: items, count: data.count });
};
