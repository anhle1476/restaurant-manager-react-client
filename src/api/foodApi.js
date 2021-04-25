import { BASE_URL } from "./constant";
import axios from "axios";

const FOODS_URL = `${BASE_URL}/foods`;

const mapToFormData = ({ name, price, unit, foodTypeId, image }) => {
  const form = new FormData();
  form.append("name", name);
  form.append("price", price);
  form.append("unit", unit);
  form.append("foodTypeId", foodTypeId);
  if (image) form.append("image", image);
  return form;
};

const create = (data) => {
  return axios.post(FOODS_URL, mapToFormData(data));
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
  return axios.put(`${FOODS_URL}/${data.id}`, mapToFormData(data));
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
