export const APP_ROUTES = {
    HOME: '/',
    PEOPLE: '/people',
    PERSON: '/people/:id',
};

interface SwapiRoutes {
    BASE_URL: string;
    PEOPLE: string;
    FILMS: string;
    SPECIES: string;
    STARSHIPS: string;
    PLANETS: string;
    VEHICLES: string;
}

export const SWAPI_ROUTES: SwapiRoutes = {
    BASE_URL: 'https://swapi.dev/api',
    PEOPLE: '/people/',
    FILMS: '/films/',
    SPECIES: '/species/',
    STARSHIPS: '/starships/',
    PLANETS: '/planets/',
    VEHICLES: '/vehicles/',
};
