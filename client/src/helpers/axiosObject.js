import axios from "axios";

const axiosObj = ({ baseURL, params }) => {
  return axios.create({
    baseURL,
    params,
  });
};

export default axiosObj;
