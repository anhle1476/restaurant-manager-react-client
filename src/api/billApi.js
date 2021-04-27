import { BASE_URL } from "./constant";
import axios from "axios";

const BILLS_URL = `${BASE_URL}/bills`;

const create = (data) => {
  return axios.post(BILLS_URL, data);
};

const getCurrentBills = () => {
  return axios.get(BILLS_URL);
};

const getById = (id) => {
  return axios.get(`${BILLS_URL}/${id}`);
};

const update = (data) => {
  return axios.put(`${BILLS_URL}/${data.id}`, data);
};

const hardDelete = (id) => {
  return axios.delete(`${BILLS_URL}/${id}`);
};

const doPayment = (data) => {
  return axios.get(`${BILLS_URL}/${data.id}/payment`, data);
};

export default {
  create,
  getCurrentBills,
  getById,
  update,
  hardDelete,
  doPayment,
};
