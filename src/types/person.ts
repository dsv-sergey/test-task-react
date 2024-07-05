export interface IPerson {
    name: string;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
    homeworld: string;
    films: string[];
    species: string[];
    vehicles: string[];
    starships: string[];
    created: string;
    edited: string;
    url: string;
}

export type TShortInfo = Omit<IPerson,
    | "films"
    | "species"
    | "vehicles"
    | "starships"
    | "created"
    | "edited"
    | "url"
>

export type TShortInfoFields = Array<keyof TShortInfo>;

export type TDetailedInfo = Omit<IPerson,
    | "created"
    | "edited"
    | "url"
>

export type TDetailedInfoFields = Array<keyof TDetailedInfo>;

export type TStringTypeFields = Omit<TDetailedInfoFields, "films" | "species" | "vehicles" | "starships">

export type TPersonListProps = {
    persons?: IPerson[];
}

export interface IPersonsRequest {
    count: number;
    next: string | null;
    previous: string | null;
    results: IPerson[];
}

export type TError = {
    message: string
}