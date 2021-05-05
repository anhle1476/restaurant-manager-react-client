import { DOMAIN } from "./constant";
import axios from "axios";

export const login = (data) => {
  return axios({
    method: "post",
    url: `${DOMAIN}/login`,
    data: data,
    withCredentials: true,
  });
};

export const refresh = () => {
  return axios.get(`${DOMAIN}/refresh`, { withCredentials: true });
};

export const logout = () => {
  return axios.get(`${DOMAIN}/clear-cookie`, { withCredentials: true });
};
