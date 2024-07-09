import { fetchFromSwapi } from './fetchFromSwapi';
import { SWAPI_ROUTES } from '../constants';
import { getQuery } from '../utils';

export const fetchPeople = async (page: number, search?: string) => {
    const query = getQuery({ page, search });
    return await fetchFromSwapi(`${SWAPI_ROUTES.PEOPLE}?${query}`);
};
