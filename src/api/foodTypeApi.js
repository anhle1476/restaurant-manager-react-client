import { BASE_URL } from "./constant";
import axios from "axios";

const FOOD_TYPE_URL = `${BASE_URL}/food-types`;

const create = (data) => {
  return axios.post(FOOD_TYPE_URL, data);
};

const getAll = () => {
  return axios.get(FOOD_TYPE_URL);
};

const getAllDeleted = () => {
  return axios.get(`${FOOD_TYPE_URL}?deleted=true`);
};

const getById = (id) => {
  return axios.get(`${FOOD_TYPE_URL}/${id}`);
};

const getAllFoodsByFoodTypeId = (id) => {
  return axios.get(`${FOOD_TYPE_URL}/${id}/foods`);
};

const update = (data) => {
  return axios.put(`${FOOD_TYPE_URL}/${data.id}`, data);
};

const softDelete = (id) => {
  return axios.delete(`${FOOD_TYPE_URL}/${id}`);
};

const restore = (id) => {
  return axios.post(`${FOOD_TYPE_URL}/${id}/restore`);
};

export default {
  getAll,
  getAllDeleted,
  getById,
  getAllFoodsByFoodTypeId,
  update,
  softDelete,
  create,
  restore,
};
