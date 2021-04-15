import { BASE_URL } from "./constant";
import axios from "axios";

const ROLES_URL = `${BASE_URL}/roles`;

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

const getAllStaffsByRoleId = (id) => {
  return axios.get(`${ROLES_URL}/${id}/staffs`);
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
  getAllStaffsByRoleId,
  update,
  softDelete,
  create,
  restore,
};
