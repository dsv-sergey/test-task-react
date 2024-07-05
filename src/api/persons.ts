import axios from "axios";
import { ORIGIN } from "../constants";

export const fetchPersons = async (page: number, search?: string) => {
    const { data } = await axios({
        method: "GET",
        url: `${ORIGIN}/people/?page=${page}${search ? `&search=${search}` : ""}`
    });

    return data;
};
