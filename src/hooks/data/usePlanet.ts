import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../api";

const KEY = "PLANETS";

export const usePlanet = (planet: string) => {
    const query = useQuery({
        queryKey: [KEY, planet],
        queryFn: () => fetchData(planet),
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });

    return query;
};
