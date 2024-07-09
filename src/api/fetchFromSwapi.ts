import {SWAPI_ROUTES} from '../constants';
import {fetchData} from "./fetchData";

export const fetchFromSwapi = async <T>(endpoint: string): Promise<T> => {
    return await fetchData<T>(`${SWAPI_ROUTES.BASE_URL}${endpoint}`);
};
