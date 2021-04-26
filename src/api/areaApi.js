import { BASE_URL } from "./constant";
import axios from "axios";

const AREAS_URL = `${BASE_URL}/areas`;

const create = (data) => {
  return axios.post(AREAS_URL, data);
};

const getAll = () => {
  return axios.get(AREAS_URL);
};

const getAllDeleted = () => {
  return axios.get(`${AREAS_URL}?deleted=true`);
};

const getById = (id) => {
  return axios.get(`${AREAS_URL}/${id}`);
};

const update = (data) => {
  return axios.put(`${AREAS_URL}/${data.id}`, data);
};

const softDelete = (id) => {
  return axios.delete(`${AREAS_URL}/${id}`);
};

const restore = (id) => {
  return axios.post(`${AREAS_URL}/${id}/restore`);
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
