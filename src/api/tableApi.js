import { BASE_URL } from "./constant";
import axios from "axios";

const TABLES_URL = `${BASE_URL}/tables`;

const create = (data) => {
  return axios.post(TABLES_URL, data);
};

const getAll = () => {
  return axios.get(TABLES_URL);
};

const getAllDeleted = () => {
  return axios.get(`${TABLES_URL}?deleted=true`);
};
const getById = (id) => {
  return axios.get(`${TABLES_URL}/${id}`);
};

const update = (data) => {
  return axios.put(`${TABLES_URL}/${data.id}`, data);
};

const softDelete = (id) => {
  return axios.delete(`${TABLES_URL}/${id}`);
};

const restore = (id) => {
  return axios.post(`${TABLES_URL}/${id}/restore`);
};

const grouping = (data) => {
  return axios.post(`${TABLES_URL}/${data.parent}/grouping`, {
    ...data,
    children: Array.from(data.children),
  });
};

const separate = (id) => {
  return axios.post(`${TABLES_URL}/${id}/separate`);
};

export default {
  getAll,
  getAllDeleted,
  getById,
  update,
  softDelete,
  create,
  restore,
  grouping,
  separate,
};
