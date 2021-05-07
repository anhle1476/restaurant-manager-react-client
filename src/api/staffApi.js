import { BASE_URL } from "./constant";
import axios from "axios";

const STAFFS_URL = `${BASE_URL}/staffs`;

const create = (data) => {
  return axios.post(STAFFS_URL, data);
};

const getAll = () => {
  return axios.get(STAFFS_URL);
};

const getAllDeleted = () => {
  return axios.get(`${STAFFS_URL}?deleted=true`);
};

const getById = (id) => {
  return axios.get(`${STAFFS_URL}/${id}`);
};

const update = (data) => {
  return axios.put(`${STAFFS_URL}/${data.id}`, data);
};

const reissuePassword = (data) => {
  return axios.post(`${STAFFS_URL}/${data.staffId}/update-password`, data);
};

const softDelete = (id) => {
  return axios.delete(`${STAFFS_URL}/${id}`);
};

const restore = (id) => {
  return axios.post(`${STAFFS_URL}/${id}/restore`);
};

export default {
  getAll,
  getAllDeleted,
  getById,
  update,
  softDelete,
  create,
  restore,
  reissuePassword,
};
