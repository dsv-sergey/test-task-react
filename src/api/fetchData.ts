import axios, { AxiosError } from 'axios';

export const fetchData = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await axios.get<T>(endpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new Error(`Error fetching data: ${axiosError.message}`);
    } else {
      throw new Error(`Error fetching data: ${error}`);
    }
  }
};
