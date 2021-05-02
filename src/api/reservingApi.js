import { BASE_URL } from "./constant";
import axios from "axios";
import { formatDateYearFirst } from "../utils/dateUtils";

const RESERVING_URL = `${BASE_URL}/reserving-orders`;

const create = (data) => {
  return axios.post(RESERVING_URL, data);
};

const getAll = () => {
  return axios.get(RESERVING_URL);
};

const getAllByDate = (date) => {
  return axios.get(`${RESERVING_URL}?date=${formatDateYearFirst(date)}`);
};

const getAllToday = () => {
  return axios.get(`${RESERVING_URL}/today`);
};

const getById = (id) => {
  return axios.get(`${RESERVING_URL}/${id}`);
};

const update = (data) => {
  return axios.put(`${RESERVING_URL}/${data.id}`, data);
};

const softDelete = (id) => {
  return axios.delete(`${RESERVING_URL}/${id}`);
};

const restore = (id) => {
  return axios.post(`${RESERVING_URL}/${id}/restore`);
};

export default {
  create,
  getAll,
  getAllByDate,
  getAllToday,
  getById,
  update,
  softDelete,
  restore,
};
