import axios from "axios";
import { BASE_URL } from "./constant";

const ACCOUNT_URL = `${BASE_URL}/account`;

export const login = (data) => {
  return axios({
    method: "post",
    url: "/login",
    data: data,
    withCredentials: true,
  });
};

export const refresh = () => {
  return axios.get("/refresh", { withCredentials: true });
};

export const logout = () => {
  return axios.get("/clear-cookie", { withCredentials: true });
};

const updateInfo = (data) => {
  return axios.post(`${ACCOUNT_URL}/update-info`, data);
};

const updatePassword = (data) => {
  return axios.post(`${ACCOUNT_URL}/update-password`, data);
};

export default {
  updateInfo,
  updatePassword,
};
