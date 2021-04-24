import { BASE_URL } from "./constant";
import axios from "axios";

const SHIFTS_URL = `${BASE_URL}/shifts`;

const create = (data) => {
  return axios.post(SHIFTS_URL, data);
};

const getAll = () => {
  return axios.get(SHIFTS_URL);
};

const getAllDeleted = () => {
  return axios.get(`${SHIFTS_URL}?deleted=true`);
};

const getAllWithBothDeletedStatus = () => {
  return axios.get(`${SHIFTS_URL}?deleted=both`);
};

const getById = (id) => {
  return axios.get(`${SHIFTS_URL}/${id}`);
};

const update = (data) => {
  return axios.put(`${SHIFTS_URL}/${data.id}`, data);
};

const softDelete = (id) => {
  return axios.delete(`${SHIFTS_URL}/${id}`);
};

const restore = (id) => {
  return axios.post(`${SHIFTS_URL}/${id}/restore`);
};

export default {
  getAll,
  getAllDeleted,
  getAllWithBothDeletedStatus,
  getById,
  update,
  softDelete,
  create,
  restore,
};
