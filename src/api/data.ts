import axios from "axios";

export const fetchData = async (url: string) => {
    const { data } = await axios({
        method: "GET",
        url,
    });

    return data;
};
