import axios from "axios";

export const useAxios = () => {
  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
  return axios.create();
};
