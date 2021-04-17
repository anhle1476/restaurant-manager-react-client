import { BASE_URL } from "./constant";
import axios from "axios";

const VIOLATION_URL = `${BASE_URL}/violations`;

const create = (data) => {
  return axios.post(VIOLATION_URL, data);
};

const getAll = () => {
  return axios.get(VIOLATION_URL);
};

const getAllDeleted = () => {
  return axios.get(`${VIOLATION_URL}?deleted=true`);
};

const getById = (id) => {
  return axios.get(`${VIOLATION_URL}/${id}`);
};

const update = (data) => {
  return axios.put(`${VIOLATION_URL}/${data.id}`, data);
};

const softDelete = (id) => {
  return axios.delete(`${VIOLATION_URL}/${id}`);
};

const restore = (id) => {
  return axios.post(`${VIOLATION_URL}/${id}/restore`);
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
