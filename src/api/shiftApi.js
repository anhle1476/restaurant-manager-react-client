import { BASE_URL } from "./constant";
import axios from "axios";

const ROLES_URL = `${BASE_URL}/shifts`;

const create = (data) => {
  return axios.post(ROLES_URL, data);
};

const getAll = () => {
  return axios.get(ROLES_URL);
};

const getAllDeleted = () => {
  return axios.get(`${ROLES_URL}?deleted=true`);
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
  getAllDeleted,
  getById,
  update,
  softDelete,
  create,
  restore,
};
