import { BASE_URL } from "./constant";
import axios from "axios";

const FOODS_URL = `${BASE_URL}/foods`;

const create = (data) => {
  return axios.post(FOODS_URL, data);
};

const getAll = () => {
  return axios.get(FOODS_URL);
};

const getAllDeleted = () => {
  return axios.get(`${FOODS_URL}?deleted=true`);
};
const getById = (id) => {
  return axios.get(`${FOODS_URL}/${id}`);
};

const update = (data) => {
  return axios.put(`${FOODS_URL}/${data.id}`, data);
};

const softDelete = (id) => {
  return axios.delete(`${FOODS_URL}/${id}`);
};

const restore = (id) => {
  return axios.post(`${FOODS_URL}/${id}/restore`);
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
