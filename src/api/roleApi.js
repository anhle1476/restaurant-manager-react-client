import { BASE_URL } from "./constant";
import axios from "axios";

const ROLES_URL = `${BASE_URL}/roles`;

const create = (data) => {
  return axios.post(ROLES_URL, data);
};

const getAll = () => {
  return axios.get(ROLES_URL);
};

const getById = (id) => {
  return axios.get(`${ROLES_URL}/${id}`);
};

const update = (data) => {
  return axios.put(`${ROLES_URL}/${data.id}`, data);
};

const softDelete = (id) => {
  return axios.delete(`${ROLES_URL}/${id}`);
};

const restore = (id) => {
  return axios.post(`${ROLES_URL}/${id}/restore`);
};

export default {
  getAll,
  getById,
  update,
  softDelete,
  create,
  restore,
};
