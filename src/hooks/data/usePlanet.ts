import { useQuery } from '@tanstack/react-query';
import { fetchData } from '../../api';
import { IPlanet } from '../../types';
import { PLANETS_KEY } from '../../constants';

export const usePlanet = (planet: string) => {
    const query = useQuery<IPlanet>({
        queryKey: [PLANETS_KEY, planet],
        queryFn: () => fetchData(planet),
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });

    return query;
};
